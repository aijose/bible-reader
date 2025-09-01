# ASV Bible Text Specifications

## Source Information

**Version**: American Standard Version (ASV)
**Copyright**: Public Domain (1901)
**Scope**: New Testament only (27 books)
**Language**: English

## Why ASV?

1. **Public Domain**: No copyright restrictions
2. **Scholarly Base**: Revised from English Revised Version
3. **Accuracy**: Close to original Greek text
4. **Stability**: Well-established verse numbering
5. **Compatibility**: Standard reference format

## Text Structure

### Books Included
1. **Gospels**: Matthew, Mark, Luke, John
2. **History**: Acts
3. **Pauline Epistles**: Romans through Philemon (13 books)
4. **General Epistles**: Hebrews through Jude (8 books)
5. **Prophecy**: Revelation

### Verse Numbering
- Follows traditional Protestant canon numbering
- Standard chapter/verse divisions
- Compatible with most study Bible references
- No disputed verses included (e.g., Mark 16:9-20 handled consistently)

## Data Sources

### Primary Sources
1. **Bible Gateway**: ASV text with clean formatting
2. **Bible Hub**: Verse-by-verse breakdown
3. **Sacred Texts Archive**: Public domain copies
4. **OpenBible.info**: Structured JSON formats

### Format Requirements
- UTF-8 encoding
- No formatting markup (plain text)
- Consistent verse numbering
- Clean paragraph breaks

## Processing Requirements

### Text Cleaning
- Remove chapter/verse numbers from text
- Standardize quotation marks
- Handle footnote references
- Preserve paragraph structure

### Verse Boundaries
- Each verse as separate entry
- Clear verse addressing (book_chapter_verse)
- Handle verses that span multiple sentences
- Preserve original punctuation

### Quality Assurance
- Verify complete NT coverage (7,957 verses)
- Check for missing or duplicate verses
- Validate special characters and encoding
- Cross-reference with multiple sources

## Output Format

The processed ASV text should match the schema in `data-schemas.md`:
- JSON structure with books/chapters/verses hierarchy
- Metadata for each book (name, genre, chapter count)
- Clean verse text ready for display and embedding

This specification ensures the Bible text foundation supports accurate commentary linking and semantic search functionality.