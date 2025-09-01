# Data Schemas

## Bible Text Schema (`bible_asv.json`)

```json
{
  "metadata": {
    "version": "American Standard Version",
    "scope": "New Testament",
    "total_books": 27,
    "total_verses": 7957
  },
  "books": {
    "matthew": {
      "metadata": {
        "name": "Matthew",
        "genre": "gospel",
        "chapters": 28,
        "verses": 1071
      },
      "chapters": {
        "1": {
          "1": "The book of the generation of Jesus Christ, the son of David, the son of Abraham.",
          "2": "Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judah and his brethren;"
        }
      }
    }
  }
}
```

## Commentary Schema (`commentaries.json`)

```json
{
  "matthew_1_1": [
    {
      "source": "Matthew Henry",
      "text": "The New Testament begins with the account of Jesus Christ...",
      "theological_tags": ["genealogy", "messiah", "davidic_covenant"],
      "length": 1247
    },
    {
      "source": "John Gill", 
      "text": "The book of the generation of Jesus Christ...",
      "theological_tags": ["genealogy", "jewish_context", "lineage"],
      "length": 892
    }
  ]
}
```

## Embeddings Schema (`embeddings.json`)

```json
{
  "metadata": {
    "model": "sentence-transformers/all-MiniLM-L6-v2",
    "dimension": 384,
    "total_verses": 7957
  },
  "verse_embeddings": {
    "matthew_1_1": [0.1234, 0.5678, -0.2345, ...],
    "matthew_1_2": [0.2345, 0.6789, -0.3456, ...]
  }
}
```

## Similarity Matrix Schema (`similarity_matrix.json`)

```json
{
  "metadata": {
    "scoring_weights": {
      "direct_references": 1.0,
      "semantic_similarity": 0.7,
      "theological_concepts": 0.8
    },
    "threshold": 0.3,
    "top_k": 5
  },
  "similarities": {
    "matthew_1_1": [
      {
        "verse": "luke_3_23",
        "score": 0.85,
        "type": "thematic",
        "reason": "genealogy"
      },
      {
        "verse": "romans_1_3",
        "score": 0.92,
        "type": "direct_reference",
        "reason": "davidic_lineage"
      }
    ]
  }
}
```

## Cross-References Schema (`cross_references.json`)

```json
{
  "metadata": {
    "source": "Traditional study Bible references",
    "coverage": "New Testament"
  },
  "direct_references": {
    "matthew_1_1": [
      "2_samuel_7_12",
      "genesis_22_18", 
      "romans_1_3",
      "revelation_22_16"
    ]
  },
  "thematic_connections": {
    "matthew_1_1": {
      "genealogy": ["luke_3_23", "1_chronicles_3_10"],
      "messiah": ["isaiah_9_6", "john_1_41"],
      "davidic_covenant": ["2_samuel_7_12", "psalm_89_3"]
    }
  }
}
```

## Verse Addressing Format

**Standard Format**: `book_chapter_verse`
- `matthew_1_1` = Matthew chapter 1, verse 1
- `revelation_22_21` = Revelation chapter 22, verse 21

**Book Name Mapping**:
```json
{
  "matthew": "Matthew",
  "mark": "Mark", 
  "luke": "Luke",
  "john": "John",
  "acts": "Acts",
  "romans": "Romans",
  "1_corinthians": "1 Corinthians",
  "2_corinthians": "2 Corinthians",
  "galatians": "Galatians",
  "ephesians": "Ephesians",
  "philippians": "Philippians",
  "colossians": "Colossians",
  "1_thessalonians": "1 Thessalonians",
  "2_thessalonians": "2 Thessalonians",
  "1_timothy": "1 Timothy",
  "2_timothy": "2 Timothy",
  "titus": "Titus",
  "philemon": "Philemon",
  "hebrews": "Hebrews",
  "james": "James",
  "1_peter": "1 Peter",
  "2_peter": "2 Peter",
  "1_john": "1 John",
  "2_john": "2 John",
  "3_john": "3 John",
  "jude": "Jude",
  "revelation": "Revelation"
}
```

## Genre Classification

```json
{
  "gospels": ["matthew", "mark", "luke", "john"],
  "history": ["acts"],
  "epistles_pauline": ["romans", "1_corinthians", "2_corinthians", "galatians", "ephesians", "philippians", "colossians", "1_thessalonians", "2_thessalonians", "1_timothy", "2_timothy", "titus", "philemon"],
  "epistles_general": ["hebrews", "james", "1_peter", "2_peter", "1_john", "2_john", "3_john", "jude"],
  "prophecy": ["revelation"]
}
```

This schema design ensures efficient data access, clear verse addressing, and support for the RAG system's similarity scoring requirements.