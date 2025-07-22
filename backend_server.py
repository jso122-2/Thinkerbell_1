#!/usr/bin/env python3
"""
Thinkerbell Python Backend Server
FastAPI-based semantic processing engine for enhanced AI classification
"""

import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import numpy as np

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import ML dependencies with fallbacks
try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_ML = True
    logger.info("✅ ML dependencies loaded successfully")
except ImportError as e:
    logger.warning(f"⚠️ ML dependencies not available: {e}")
    logger.info("📦 Install with: pip install sentence-transformers scikit-learn")
    HAS_ML = False

# Pydantic models
class ProcessRequest(BaseModel):
    content: str
    template_type: str = "slide_deck"
    title: str = "Thinkerbell Brief"
    confidence_threshold: float = 0.3

class ProcessResponse(BaseModel):
    routed_content: Dict
    analytics: Dict
    processing_time_ms: float
    method: str = "python_backend"

class ExplainRequest(BaseModel):
    sentence: str

class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: str
    ml_available: bool
    model_loaded: bool

class SemanticBrain:
    """Advanced semantic classification engine using sentence transformers"""
    
    def __init__(self):
        self.model = None
        self.anchor_embeddings = {}
        self.confidence_threshold = 0.3
        self.model_name = "all-MiniLM-L6-v2"
        
    async def initialize(self):
        """Initialize ML models and anchor embeddings"""
        if not HAS_ML:
            logger.warning("🚫 ML dependencies not available - using fallback classification")
            return False
            
        try:
            logger.info(f"🔄 Loading semantic model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            await self._load_anchor_embeddings()
            logger.info("✅ Semantic brain initialized successfully")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to initialize semantic brain: {e}")
            return False
    
    async def _load_anchor_embeddings(self):
        """Precompute embeddings for Thinkerbell's semantic anchors"""
        anchors = {
            "Hunch": """
                A clever suspicion, intuitive idea, or hypothesis. 
                Often playful speculation without concrete proof yet.
                Keywords: guess, intuition, feeling, suspect, theory, wonder, might, think.
            """,
            "Wisdom": """
                Strategic insights backed by data, research, or experience.
                Evidence-based knowledge and proven learnings.
                Keywords: research, data, studies, evidence, analysis, statistics, shows, proves.
            """,
            "Nudge": """
                Recommended actions, behavioral suggestions, or next steps.
                Gentle pushes toward desired behaviors or decisions.
                Keywords: should, recommend, suggest, action, try, implement, do, start.
            """,
            "Spell": """
                Magical creative flourishes, surprising executions, or innovative ideas.
                Unexpected solutions that feel almost magical in their creativity.
                Keywords: magical, surprising, creative, innovative, extraordinary, imagine, picture.
            """
        }
        
        # Compute embeddings for anchor descriptions
        anchor_texts = list(anchors.values())
        embeddings = self.model.encode(anchor_texts)
        
        self.anchor_embeddings = {
            category: embeddings[i] 
            for i, category in enumerate(anchors.keys())
        }
        
        logger.info("🧠 Anchor embeddings computed and cached")

    async def classify_text(self, text: str, confidence_threshold: float = None) -> Dict:
        """Main classification endpoint with enhanced AI processing"""
        start_time = asyncio.get_event_loop().time()
        
        if not self.model:
            return self._fallback_classification(text)
        
        threshold = confidence_threshold or self.confidence_threshold
        
        # Process text into sentences
        sentences = self._split_sentences(text)
        routed_content = {}
        
        for sentence in sentences:
            if len(sentence.strip()) < 10:  # Skip very short sentences
                continue
                
            category, confidence = await self._classify_sentence(sentence, threshold)
            
            if category not in routed_content:
                routed_content[category] = []
                
            routed_content[category].append({
                "text": sentence.strip(),
                "confidence": float(confidence),
                "processing_method": "sentence_transformer"
            })
        
        # Sort by confidence within each category
        for category in routed_content:
            routed_content[category].sort(
                key=lambda x: x["confidence"], 
                reverse=True
            )
        
        # Generate analytics
        analytics = self._generate_analytics(routed_content)
        
        processing_time = (asyncio.get_event_loop().time() - start_time) * 1000
        
        return {
            "routed_content": routed_content,
            "analytics": analytics,
            "processing_time_ms": processing_time
        }
    
    async def _classify_sentence(self, sentence: str, threshold: float) -> Tuple[str, float]:
        """Classify individual sentence using semantic similarity"""
        if not self.model or not self.anchor_embeddings:
            return "Hunch", 0.5  # Fallback
        
        try:
            # Get sentence embedding
            sentence_embedding = self.model.encode([sentence])
            
            # Compute similarities to all anchors
            similarities = {}
            for category, anchor_embedding in self.anchor_embeddings.items():
                similarity = cosine_similarity(
                    sentence_embedding, 
                    [anchor_embedding]
                )[0][0]
                similarities[category] = similarity
            
            # Find best match
            best_category = max(similarities.keys(), key=lambda k: similarities[k])
            best_score = similarities[best_category]
            
            # Apply confidence threshold
            if best_score < threshold:
                return "Hunch", best_score  # Default to Hunch for low confidence
                
            return best_category, best_score
            
        except Exception as e:
            logger.error(f"Classification error: {e}")
            return "Hunch", 0.3
    
    def _split_sentences(self, text: str) -> List[str]:
        """Smart sentence splitting with context preservation"""
        import re
        
        # Split on sentence endings, but preserve context
        sentences = re.split(r'[.!?]+\s+', text)
        
        # Clean and filter sentences
        cleaned = []
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 10:  # Minimum length for meaningful classification
                cleaned.append(sentence)
        
        return cleaned
    
    def _generate_analytics(self, routed_content: Dict) -> Dict:
        """Generate comprehensive analytics about the classification"""
        total_items = sum(len(items) for items in routed_content.values())
        
        if total_items == 0:
            return {
                "error": "No content to analyze",
                "total_sentences": 0
            }
        
        # Calculate distribution
        distribution = {}
        confidence_stats = {}
        
        for category, items in routed_content.items():
            count = len(items)
            distribution[category] = {
                "count": count,
                "percentage": round(count / total_items * 100, 1)
            }
            
            if items:
                confidences = [item["confidence"] for item in items]
                confidence_stats[category] = {
                    "average": round(sum(confidences) / len(confidences), 3),
                    "max": round(max(confidences), 3),
                    "min": round(min(confidences), 3)
                }
            else:
                confidence_stats[category] = {"average": 0, "max": 0, "min": 0}
        
        # Find dominant category
        dominant_category = max(
            distribution.keys(), 
            key=lambda k: distribution[k]["count"]
        ) if distribution else "Hunch"
        
        # Calculate high confidence items
        high_confidence_count = sum(
            1 for items in routed_content.values() 
            for item in items 
            if item["confidence"] > 0.7
        )
        
        return {
            "distribution": distribution,
            "confidence_stats": confidence_stats,
            "dominant_category": dominant_category,
            "total_sentences": total_items,
            "high_confidence_items": high_confidence_count,
            "processing_method": "python_sentence_transformer"
        }
    
    def _fallback_classification(self, text: str) -> Dict:
        """Fallback classification when ML models aren't available"""
        logger.info("Using fallback keyword-based classification")
        
        sentences = self._split_sentences(text)
        routed_content = {"Hunch": [], "Wisdom": [], "Nudge": [], "Spell": []}
        
        # Simple keyword-based classification
        for sentence in sentences:
            if len(sentence.strip()) < 10:
                continue
                
            lower_sentence = sentence.lower()
            confidence = 0.5  # Default confidence for keyword matching
            
            # Classify based on keywords
            if any(word in lower_sentence for word in ['data', 'research', 'study', 'evidence', 'statistics', 'shows', 'analysis']):
                category = "Wisdom"
                confidence = 0.7
            elif any(word in lower_sentence for word in ['should', 'recommend', 'suggest', 'implement', 'action', 'do', 'try']):
                category = "Nudge"
                confidence = 0.6
            elif any(word in lower_sentence for word in ['imagine', 'creative', 'innovative', 'magical', 'surprising', 'extraordinary']):
                category = "Spell"
                confidence = 0.6
            else:
                category = "Hunch"  # Default category
                confidence = 0.4
            
            routed_content[category].append({
                "text": sentence.strip(),
                "confidence": confidence,
                "processing_method": "keyword_fallback"
            })
        
        analytics = self._generate_analytics(routed_content)
        
        return {
            "routed_content": routed_content,
            "analytics": analytics,
            "processing_time_ms": 5.0  # Fast keyword processing
        }

# Initialize FastAPI app
app = FastAPI(
    title="Thinkerbell Semantic Engine API",
    description="🎭 Measured Magic for content classification and template generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global semantic brain instance
semantic_brain = SemanticBrain()

@app.on_event("startup")
async def startup_event():
    """Initialize the semantic brain on startup"""
    logger.info("🚀 Starting Thinkerbell Python Backend Server...")
    success = await semantic_brain.initialize()
    if success:
        logger.info("✅ Server ready with advanced semantic processing")
    else:
        logger.info("⚠️ Server ready with fallback processing")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service="Thinkerbell Semantic Engine",
        timestamp=datetime.now().isoformat(),
        ml_available=HAS_ML,
        model_loaded=semantic_brain.model is not None
    )

@app.post("/process", response_model=ProcessResponse)
async def process_content(
    request: ProcessRequest,
    background_tasks: BackgroundTasks
):
    """Main semantic processing endpoint"""
    try:
        logger.info(f"Processing content: {len(request.content)} characters")
        
        result = await semantic_brain.classify_text(
            text=request.content,
            confidence_threshold=request.confidence_threshold
        )
        
        # Add metadata
        result["method"] = "python_backend"
        result["template_type"] = request.template_type
        result["title"] = request.title
        
        logger.info(f"✅ Processing complete: {result['analytics']['total_sentences']} sentences classified")
        
        return ProcessResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Processing failed: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Processing failed: {str(e)}"
        )

@app.post("/explain")
async def explain_classification(request: ExplainRequest):
    """Explain why content was classified a certain way"""
    try:
        if not semantic_brain.model:
            return {
                "sentence": request.sentence,
                "explanation": "Using keyword-based fallback classification",
                "method": "keyword_fallback",
                "confidence": 0.5
            }
        
        # Get classification for single sentence
        category, confidence = await semantic_brain._classify_sentence(
            request.sentence, 
            semantic_brain.confidence_threshold
        )
        
        # Generate explanation
        explanation = f"Classified as '{category}' with {confidence:.1%} confidence. "
        
        if confidence > 0.7:
            explanation += "High confidence classification based on semantic similarity to category anchors."
        elif confidence > 0.5:
            explanation += "Moderate confidence classification. Consider reviewing for accuracy."
        else:
            explanation += "Low confidence classification. Defaulted to 'Hunch' category."
        
        return {
            "sentence": request.sentence,
            "category": category,
            "confidence": float(confidence),  # Convert numpy.float32 to Python float
            "explanation": explanation,
            "method": "sentence_transformer" if semantic_brain.model else "keyword_fallback"
        }
        
    except Exception as e:
        logger.error(f"Explanation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    """List available semantic models and their status"""
    return {
        "current_model": semantic_brain.model_name if semantic_brain.model else "none",
        "ml_dependencies_available": HAS_ML,
        "model_loaded": semantic_brain.model is not None,
        "available_models": [
            {
                "name": "all-MiniLM-L6-v2",
                "description": "Fast, lightweight sentence transformer (default)",
                "size": "22MB",
                "languages": ["multilingual"]
            },
            {
                "name": "all-mpnet-base-v2",
                "description": "High quality sentence embeddings",
                "size": "420MB", 
                "languages": ["english"]
            }
        ],
        "fallback_method": "keyword-based classification"
    }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "Thinkerbell Semantic Engine",
        "version": "1.0.0",
        "description": "🎭 Measured Magic for content classification",
        "endpoints": {
            "/health": "Health check and system status",
            "/process": "Main semantic processing endpoint", 
            "/explain": "Explain classification decisions",
            "/models": "List available models",
            "/docs": "Interactive API documentation"
        },
        "status": "ready",
        "ml_available": HAS_ML
    }

def main():
    """Run the server"""
    logger.info("🎭 Thinkerbell Python Backend Server")
    logger.info("📡 Starting on http://localhost:8000")
    
    uvicorn.run(
        "backend_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main() 