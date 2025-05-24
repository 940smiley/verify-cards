import { useState } from 'react'
import './App.css'

// Card type definition
type Card = {
  id: number;
  name: string;
  number: string;
  year: string;
  brand: string;
  set: string;
  image?: string;
  status: 'working set' | 'good to go' | 'duplicate' | 'need photo' | 'new need to scan' | 'destroyed' | 'sold';
};

const initialCards: Card[] = [];

function App() {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [filter, setFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newCard, setNewCard] = useState<Partial<Card>>({});

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewCard((prev) => ({ ...prev, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new card
  const handleAddCard = () => {
    if (!newCard.name || !newCard.number || !newCard.year || !newCard.brand || !newCard.set) return;
    setCards([
      ...cards,
      {
        ...newCard,
        id: Date.now(),
        status: 'working set',
      } as Card,
    ]);
    setNewCard({});
    setUploading(false);
  };

  // Filter cards
  const filteredCards = cards.filter((card) =>
    filter === '' || card.status === filter
  );

  return (
    <div className="app-bg">
      <header className="app-header">
        <h1>Card Collector Nerdy GUI</h1>
        <button className="upload-btn" onClick={() => setUploading((u) => !u)}>
          {uploading ? 'Cancel' : 'Add New Card'}
        </button>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="working set">Working Set</option>
          <option value="good to go">Good to Go</option>
          <option value="duplicate">Duplicate</option>
          <option value="need photo">Need Photo</option>
          <option value="new need to scan">Need to Scan</option>
          <option value="destroyed">Destroyed</option>
          <option value="sold">Sold</option>
        </select>
      </header>
      {uploading && (
        <div className="card-upload-form">
          <input
            type="text"
            placeholder="Name"
            value={newCard.name || ''}
            onChange={(e) => setNewCard((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Number"
            value={newCard.number || ''}
            onChange={(e) => setNewCard((prev) => ({ ...prev, number: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Year"
            value={newCard.year || ''}
            onChange={(e) => setNewCard((prev) => ({ ...prev, year: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Brand"
            value={newCard.brand || ''}
            onChange={(e) => setNewCard((prev) => ({ ...prev, brand: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Set"
            value={newCard.set || ''}
            onChange={(e) => setNewCard((prev) => ({ ...prev, set: e.target.value }))}
          />
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {newCard.image && <img src={newCard.image} alt="preview" className="preview-img" />}
          <button onClick={handleAddCard}>Add Card</button>
        </div>
      )}
      <main className="card-list">
        {filteredCards.length === 0 ? (
          <p className="empty-msg">No cards to display.</p>
        ) : (
          filteredCards.map((card) => (
            <div className={`card-item card-status-${card.status.replace(/\s/g, '-')}`} key={card.id}>
              <div className="card-img-wrap">
                {card.image ? (
                  <img src={card.image} alt={card.name} className="card-img" />
                ) : (
                  <div className="card-img-placeholder">No Image</div>
                )}
              </div>
              <div className="card-info">
                <h2>{card.name}</h2>
                <p>#{card.number} | {card.year}</p>
                <p>{card.brand} - {card.set}</p>
                <span className={`status-badge status-${card.status.replace(/\s/g, '-')}`}>{card.status}</span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default App
