import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { bookService } from '../services/bookService';
import { BookSearchResultSource } from '../types/book';
import type { BookSearchResult, Condition, ListingDetails } from '../types/book';
import './AddBook.css';

type Step = 'search' | 'confirm' | 'manual' | 'success';

const sourceLabel = (source: BookSearchResultSource) => {
  switch (source) {
    case BookSearchResultSource.Local:
      return 'In Catalog';
    case BookSearchResultSource.Manual:
      return 'Manually Added';
    case BookSearchResultSource.GoogleBooks:
    default:
      return 'Google Books';
  }
};

export const AddBook = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [conditions, setConditions] = useState<Condition[]>([]);
  const [conditionsError, setConditionsError] = useState('');

  const [selectedResult, setSelectedResult] = useState<BookSearchResult | null>(null);
  const [conditionId, setConditionId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [completedListing, setCompletedListing] = useState<ListingDetails | null>(null);

  // Manual entry form state
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthors, setManualAuthors] = useState('');
  const [manualGenres, setManualGenres] = useState('');
  const [manualPublisher, setManualPublisher] = useState('');
  const [manualPublishedYear, setManualPublishedYear] = useState('');
  const [manualPageCount, setManualPageCount] = useState('');
  const [manualCoverImageUrl, setManualCoverImageUrl] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualIsbn10, setManualIsbn10] = useState('');
  const [manualIsbn13, setManualIsbn13] = useState('');
  const [manualFormError, setManualFormError] = useState('');

  useEffect(() => {
    bookService
      .getConditions()
      .then((data) => {
        setConditions(data);
        if (data.length > 0) {
          setConditionId(String(data[0].id));
        }
      })
      .catch(() => setConditionsError('Could not load book conditions. Please try again later.'));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setSearchError('');
    try {
      const data = await bookService.searchBooks(query.trim());
      setResults(data);
      setHasSearched(true);
    } catch {
      setSearchError('Something went wrong while searching. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = (result: BookSearchResult) => {
    setSelectedResult(result);
    setSubmitError('');
    setStep('confirm');
  };

  const handleStartManualEntry = () => {
    setManualTitle(query);
    setManualFormError('');
    setStep('manual');
  };

  const handleBackToSearch = () => {
    setSelectedResult(null);
    setSubmitError('');
    setManualFormError('');
    setStep('search');
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResult || !conditionId) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const listing = await bookService.createListing({
        catalogId: selectedResult.catalogId ?? undefined,
        googleBooksId: selectedResult.googleBooksId ?? undefined,
        conditionId: Number(conditionId),
        notes: notes.trim() || undefined,
      });
      setCompletedListing(listing);
      setStep('success');
    } catch {
      setSubmitError('Could not add this book to your library. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!manualTitle.trim() || !manualAuthors.trim()) {
      setManualFormError('Title and at least one author are required.');
      return;
    }
    if (!conditionId) {
      setManualFormError('Please select a condition.');
      return;
    }

    setSubmitting(true);
    setManualFormError('');
    try {
      const listing = await bookService.createManualBook({
        title: manualTitle.trim(),
        authors: manualAuthors.split(',').map((a) => a.trim()).filter(Boolean),
        genres: manualGenres
          ? manualGenres.split(',').map((g) => g.trim()).filter(Boolean)
          : undefined,
        publisher: manualPublisher.trim() || undefined,
        publishedYear: manualPublishedYear ? Number(manualPublishedYear) : undefined,
        pageCount: manualPageCount ? Number(manualPageCount) : undefined,
        coverImageUrl: manualCoverImageUrl.trim() || undefined,
        description: manualDescription.trim() || undefined,
        isbn10: manualIsbn10.trim() || undefined,
        isbn13: manualIsbn13.trim() || undefined,
        conditionId: Number(conditionId),
        notes: notes.trim() || undefined,
      });
      setCompletedListing(listing);
      setStep('success');
    } catch {
      setManualFormError('Could not add this book to your library. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setStep('search');
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setSelectedResult(null);
    setNotes('');
    setCompletedListing(null);
    setManualTitle('');
    setManualAuthors('');
    setManualGenres('');
    setManualPublisher('');
    setManualPublishedYear('');
    setManualPageCount('');
    setManualCoverImageUrl('');
    setManualDescription('');
    setManualIsbn10('');
    setManualIsbn13('');
  };

  return (
    <div className="add-book">
      <Navbar />
      <div className="add-book-container">
        <section className="add-book-header">
          <h1>Add a Book to Your Library 📚</h1>
          <p>Search for a book to list it for exchange, or add it manually if we can't find it.</p>
        </section>

        {step === 'search' && (
          <section className="add-book-card">
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search by title, author, genre, or ISBN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={searching}
              />
              <button type="submit" className="btn-primary" disabled={searching || !query.trim()}>
                {searching ? 'Searching...' : 'Search'}
              </button>
            </form>

            {searchError && <p className="form-error">{searchError}</p>}

            {hasSearched && !searching && (
              <div className="search-results">
                {results.length > 0 ? (
                  <ul className="result-list">
                    {results.map((result, index) => (
                      <li key={result.catalogId ?? result.googleBooksId ?? index} className="result-item">
                        <div className="result-cover">
                          {result.coverImageUrl ? (
                            <img src={result.coverImageUrl} alt={result.title} />
                          ) : (
                            <div className="result-cover-placeholder">📖</div>
                          )}
                        </div>
                        <div className="result-info">
                          <h3>{result.title}</h3>
                          <p className="result-authors">
                            {result.authors.length > 0 ? result.authors.join(', ') : 'Unknown author'}
                          </p>
                          <span className="result-source-badge">{sourceLabel(result.source)}</span>
                        </div>
                        <button className="btn-secondary" onClick={() => handleSelectResult(result)}>
                          Select
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-results">No matches found for "{query}".</p>
                )}

                <button className="link-button" onClick={handleStartManualEntry}>
                  Can't find your book? Add it manually
                </button>
              </div>
            )}
          </section>
        )}

        {step === 'confirm' && selectedResult && (
          <section className="add-book-card">
            <button className="link-button back-link" onClick={handleBackToSearch}>
              ← Back to search
            </button>

            <div className="selected-book">
              <div className="result-cover">
                {selectedResult.coverImageUrl ? (
                  <img src={selectedResult.coverImageUrl} alt={selectedResult.title} />
                ) : (
                  <div className="result-cover-placeholder">📖</div>
                )}
              </div>
              <div className="result-info">
                <h3>{selectedResult.title}</h3>
                <p className="result-authors">
                  {selectedResult.authors.length > 0 ? selectedResult.authors.join(', ') : 'Unknown author'}
                </p>
                {selectedResult.publisher && <p className="result-meta">{selectedResult.publisher}</p>}
              </div>
            </div>

            <form className="confirm-form" onSubmit={handleConfirmSubmit}>
              {conditionsError && <p className="form-error">{conditionsError}</p>}

              <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  value={conditionId}
                  onChange={(e) => setConditionId(e.target.value)}
                  required
                >
                  {conditions.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any extra details about this copy..."
                  rows={3}
                />
              </div>

              {submitError && <p className="form-error">{submitError}</p>}

              <button type="submit" className="btn-primary" disabled={submitting || !conditionId}>
                {submitting ? 'Adding...' : 'Add to My Library'}
              </button>
            </form>
          </section>
        )}

        {step === 'manual' && (
          <section className="add-book-card">
            <button className="link-button back-link" onClick={handleBackToSearch}>
              ← Back to search
            </button>

            <h2>Add This Book Manually</h2>
            <form className="manual-form" onSubmit={handleManualSubmit}>
              <div className="form-group">
                <label htmlFor="manualTitle">Title *</label>
                <input
                  id="manualTitle"
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="manualAuthors">Author(s) * (comma-separated)</label>
                <input
                  id="manualAuthors"
                  type="text"
                  value={manualAuthors}
                  onChange={(e) => setManualAuthors(e.target.value)}
                  placeholder="e.g. Brandon Sanderson"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="manualGenres">Genre(s) (comma-separated)</label>
                  <input
                    id="manualGenres"
                    type="text"
                    value={manualGenres}
                    onChange={(e) => setManualGenres(e.target.value)}
                    placeholder="e.g. Fantasy, Adventure"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="manualPublisher">Publisher</label>
                  <input
                    id="manualPublisher"
                    type="text"
                    value={manualPublisher}
                    onChange={(e) => setManualPublisher(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="manualPublishedYear">Published Year</label>
                  <input
                    id="manualPublishedYear"
                    type="number"
                    value={manualPublishedYear}
                    onChange={(e) => setManualPublishedYear(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="manualPageCount">Page Count</label>
                  <input
                    id="manualPageCount"
                    type="number"
                    value={manualPageCount}
                    onChange={(e) => setManualPageCount(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="manualIsbn10">ISBN-10</label>
                  <input
                    id="manualIsbn10"
                    type="text"
                    value={manualIsbn10}
                    onChange={(e) => setManualIsbn10(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="manualIsbn13">ISBN-13</label>
                  <input
                    id="manualIsbn13"
                    type="text"
                    value={manualIsbn13}
                    onChange={(e) => setManualIsbn13(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="manualCoverImageUrl">Cover Image URL</label>
                <input
                  id="manualCoverImageUrl"
                  type="text"
                  value={manualCoverImageUrl}
                  onChange={(e) => setManualCoverImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="manualDescription">Description</label>
                <textarea
                  id="manualDescription"
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {conditionsError && <p className="form-error">{conditionsError}</p>}

              <div className="form-group">
                <label htmlFor="manualCondition">Condition</label>
                <select
                  id="manualCondition"
                  value={conditionId}
                  onChange={(e) => setConditionId(e.target.value)}
                  required
                >
                  {conditions.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="manualNotes">Notes (optional)</label>
                <textarea
                  id="manualNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {manualFormError && <p className="form-error">{manualFormError}</p>}

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add to My Library'}
              </button>
            </form>
          </section>
        )}

        {step === 'success' && completedListing && (
          <section className="add-book-card success-card">
            <div className="success-icon">✅</div>
            <h2>"{completedListing.title}" was added to your library!</h2>
            <p>It's now listed with condition: {completedListing.conditionName}</p>
            <div className="success-actions">
              <button className="btn-primary" onClick={handleAddAnother}>
                Add Another Book
              </button>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AddBook;
