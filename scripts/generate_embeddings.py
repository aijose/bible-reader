#!/usr/bin/env python3
"""
Generate embeddings for Bible verses using sentence-transformers.
Requires: pip install sentence-transformers torch numpy
"""

import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer
from datetime import datetime

def load_bible_data(bible_path):
    """Load Bible JSON data and extract all verses."""
    print(f"Loading Bible data from {bible_path}...")
    
    if not os.path.exists(bible_path):
        print(f"Error: Bible data file not found at {bible_path}")
        print("Please run 'node scripts/process_bible.js' first")
        return None
    
    with open(bible_path, 'r', encoding='utf-8') as f:
        bible_data = json.load(f)
    
    verses = {}
    total_verses = 0
    
    for book_key, book_data in bible_data['books'].items():
        for chapter_num, chapter_data in book_data['chapters'].items():
            for verse_num, verse_text in chapter_data.items():
                verse_id = f"{book_key}_{chapter_num}_{verse_num}"
                verses[verse_id] = verse_text
                total_verses += 1
    
    print(f"Loaded {total_verses} verses from {len(bible_data['books'])} books")
    return verses, bible_data['metadata']

def generate_embeddings(verses):
    """Generate embeddings for all verses using sentence-transformers."""
    print("Loading sentence-transformers model...")
    
    try:
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Please install: pip install sentence-transformers torch")
        return None
    
    print(f"Generating embeddings for {len(verses)} verses...")
    
    verse_ids = list(verses.keys())
    verse_texts = list(verses.values())
    
    # Generate embeddings in batches for memory efficiency
    batch_size = 100
    all_embeddings = []
    
    for i in range(0, len(verse_texts), batch_size):
        batch_texts = verse_texts[i:i + batch_size]
        batch_ids = verse_ids[i:i + batch_size]
        
        print(f"Processing batch {i//batch_size + 1}/{(len(verse_texts) + batch_size - 1)//batch_size}")
        
        batch_embeddings = model.encode(batch_texts, normalize_embeddings=True)
        all_embeddings.extend(batch_embeddings)
    
    # Convert to dictionary format
    embeddings_dict = {}
    for verse_id, embedding in zip(verse_ids, all_embeddings):
        embeddings_dict[verse_id] = embedding.tolist()
    
    print("✅ Embedding generation complete")
    return embeddings_dict, model.get_sentence_embedding_dimension()

def save_embeddings(embeddings, dimension, bible_metadata, output_path):
    """Save embeddings to JSON file."""
    print(f"Saving embeddings to {output_path}...")
    
    output_data = {
        "metadata": {
            "model": "sentence-transformers/all-MiniLM-L6-v2",
            "dimension": dimension,
            "total_verses": len(embeddings),
            "bible_version": bible_metadata.get("version", "Unknown"),
            "processing_date": datetime.now().isoformat(),
            "normalization": "L2 normalized for cosine similarity"
        },
        "verse_embeddings": embeddings
    }
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2)
        
        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"✅ Embeddings saved successfully")
        print(f"📁 Output written to: {output_path}")
        print(f"📏 File size: {file_size_mb:.1f}MB")
        print(f"📊 Embeddings generated: {len(embeddings)}")
        print(f"📐 Dimension: {dimension}")
        
    except Exception as e:
        print(f"Error saving embeddings: {e}")

def main():
    print("Starting Bible verse embedding generation...")
    
    # Paths
    project_root = os.path.dirname(os.getcwd())
    bible_path = os.path.join(project_root, 'public', 'data', 'bible_asv.json')
    output_path = os.path.join(project_root, 'public', 'data', 'embeddings.json')
    
    # Load Bible data
    verses_data = load_bible_data(bible_path)
    if verses_data is None:
        return
    
    verses, bible_metadata = verses_data
    
    # Generate embeddings
    embeddings_result = generate_embeddings(verses)
    if embeddings_result is None:
        return
    
    embeddings, dimension = embeddings_result
    
    # Save results
    save_embeddings(embeddings, dimension, bible_metadata, output_path)
    
    print("\n🎉 Embedding generation pipeline complete!")
    print("Next step: Run 'node scripts/build_similarity_matrix.js'")

if __name__ == "__main__":
    main()