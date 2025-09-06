
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

const App = () => {
  const [view, setView] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  if (!isConnected) {
    return (
      <ConnectModal onConnect={handleConnect} />
    );
  }

  return (
    <>
      <Sidebar currentView={view} setView={setView} />
      <main className="main-content">
        {view === 'dashboard' && <Dashboard />}
        {view === 'new-campaign' && <NewCampaign />}
      </main>
    </>
  );
};

const ConnectModal = ({ onConnect }) => {
    const [isLoadingQr, setIsLoadingQr] = useState(true);

    // Simulate fetching the QR code
    useEffect(() => {
        const timer = setTimeout(() => setIsLoadingQr(false), 1500); // simulate 1.5s load time
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="modal-overlay">
            <div className="modal-content connect-modal">
                <div className="connect-modal-header"></div>
                <div className="connect-modal-body">
                    <div className="instructions-pane">
                        <h3>Use WhatsApp on your computer</h3>
                        <ol className="instructions-list">
                            <li>Open WhatsApp on your phone</li>
                            <li>Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong></li>
                            <li>Tap on <strong>Link a device</strong></li>
                            <li>Point your phone to this screen to capture the code</li>
                        </ol>
                        <a href="#" className="help-link" target="_blank" rel="noopener noreferrer">Need help to get started?</a>
                    </div>
                    <div className="qr-pane">
                        <div className="qr-code-container">
                            {isLoadingQr ? (
                                <div className="loader"></div>
                            ) : (
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" />
                            )}
                        </div>
                         <button className="btn btn-primary" style={{marginTop: '1.5rem', width: '100%', textAlign: 'center'}} onClick={onConnect}>
                            Continue to Dashboard (Demo)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


const Sidebar = ({ currentView, setView }) => {
  return (
    <nav className="sidebar">
      <div>
        <div className="sidebar-header">
          <span className="material-symbols-outlined logo">send</span>
          <h1>WA Manager</h1>
        </div>
        <div className="nav-menu">
          <a href="#" className={currentView === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className={currentView === 'new-campaign' ? 'active' : ''} onClick={() => setView('new-campaign')}>
            <span className="material-symbols-outlined">add_circle</span>
            <span>New Campaign</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

const Dashboard = () => {
    const [filter, setFilter] = useState('This Week');
    
    return (
        <>
            <header>
                <h2>Dashboard</h2>
                <p>An overview of your campaign performance.</p>
            </header>
            <div className="card">
                <div className="card-header">
                    <h3>Analytics</h3>
                     <div className="date-filters">
                        {['Today', 'This Week', 'This Month'].map(f => (
                            <button key={f} className={`btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                        ))}
                    </div>
                </div>
                 <div className="dashboard-grid">
                    <StatCard icon="send" title="Messages Sent" value="1,420" />
                    <StatCard icon="check_circle" title="Delivered" value="1,398" />
                    <StatCard icon="forum" title="Responses Received" value="287" />
                    <StatCard icon="trending_up" title="Response Rate" value="20.5%" />
                </div>
                 {/* Placeholder for chart */}
                <div style={{marginTop: '2rem', textAlign: 'center', color: 'var(--text-light)'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '4rem'}}>bar_chart</span>
                    <p>Campaign chart would be displayed here.</p>
                </div>
            </div>
        </>
    );
}

const StatCard = ({ icon, title, value }) => {
    return (
        <div className="stat-card">
            <span className="material-symbols-outlined icon">{icon}</span>
            <h3>{title}</h3>
            <p className="value">{value}</p>
        </div>
    );
}

const NewCampaign = () => {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [buttons, setButtons] = useState([]);
    const [showAiModal, setShowAiModal] = useState(false);
    const [showAddButtonModal, setShowAddButtonModal] = useState(false);

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleAddButton = (button) => {
        if (buttons.length < 3) { // Limit buttons for UI sanity
            setButtons([...buttons, button]);
        }
    };

    return (
        <>
            <header>
                <h2>Create New Campaign</h2>
                <p>Design your message and send it to your customers.</p>
            </header>
            <div className="campaign-creator">
                <div className="form-column">
                    <div className="card">
                        <div className="form-group">
                            <label htmlFor="campaignName">Campaign Name</label>
                            <input type="text" id="campaignName" className="form-control" placeholder="e.g., Summer Sale 2024" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="googleSheet">Google Sheet Link</label>
                            <input type="text" id="googleSheet" className="form-control" placeholder="Link to your customer data sheet" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message here..."></textarea>
                        </div>
                         <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                             <button className="btn btn-ai" onClick={() => setShowAiModal(true)}>
                                 <span className="material-symbols-outlined">auto_awesome</span>
                                 Generate with AI
                             </button>
                             <input type="file" id="imageUpload" accept="image/*" style={{display: 'none'}} onChange={handleImageUpload} />
                             <button className="btn" onClick={() => document.getElementById('imageUpload').click()}>
                                 <span className="material-symbols-outlined">image</span>
                                 Add Image
                             </button>
                             <button className="btn" onClick={() => setShowAddButtonModal(true)}>
                                 <span className="material-symbols-outlined">smart_button</span>
                                 Add Button
                             </button>
                         </div>
                    </div>
                     <div style={{marginTop: '1rem'}}>
                         <button className="btn btn-primary" style={{padding: '0.75rem 1.5rem'}}>Send Campaign</button>
                     </div>
                </div>
                <div className="preview-column">
                     <div className="phone-preview">
                        <div className="phone-screen">
                            <div className={`whatsapp-message ${image ? 'with-image' : ''}`}>
                                {image && <div className="preview-image" style={{backgroundImage: `url(${image})`}}></div>}
                                <div className="preview-text">{message || 'Your message will appear here...'}</div>
                            </div>
                            {buttons.length > 0 && (
                                <div className="preview-buttons">
                                    {buttons.map((button, index) => (
                                        <div key={index} className="preview-button">
                                            <span className="material-symbols-outlined">link</span>
                                            {button.text}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showAiModal && <AiGeneratorModal onClose={() => setShowAiModal(false)} onGenerate={setMessage} />}
            {showAddButtonModal && <AddButtonModal onClose={() => setShowAddButtonModal(false)} onSave={handleAddButton} />}
        </>
    );
};

const AiGeneratorModal = ({ onClose, onGenerate }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a short, engaging WhatsApp marketing message for the following purpose: "${prompt}". Keep it concise and friendly.`,
            });
            onGenerate(response.text);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to generate content. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Generate with AI</h3>
                <p>Describe the goal of your message, and AI will write it for you.</p>
                <div className="form-group" style={{textAlign: 'left'}}>
                    <label htmlFor="aiPrompt">Prompt</label>
                    <textarea 
                        id="aiPrompt" 
                        className="form-control" 
                        rows={3} 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A 20% discount on shoes for Diwali"
                    />
                </div>
                {error && <p style={{color: 'var(--danger-color)'}}>{error}</p>}
                {isLoading ? <div className="loader"></div> : (
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                        <button className="btn" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleGenerate}>Generate</button>
                    </div>
                )}
            </div>
        </div>
    );
}

const AddButtonModal = ({ onClose, onSave }) => {
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!text || !url) {
            setError('Both button text and URL are required.');
            return;
        }
        try {
            new URL(url);
        } catch (_) {
            setError('Please enter a valid URL (e.g., https://example.com).');
            return;
        }
        setError('');
        onSave({ text, url });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Add a Website Button</h3>
                <p>Enter the text for your button and the URL it should link to.</p>
                <div className="form-group" style={{textAlign: 'left', marginTop: '1.5rem'}}>
                    <label htmlFor="buttonText">Button Text</label>
                    <input
                        type="text"
                        id="buttonText"
                        className="form-control"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g., Shop Now, Learn More"
                    />
                </div>
                <div className="form-group" style={{textAlign: 'left'}}>
                    <label htmlFor="buttonUrl">URL</label>
                    <input
                        type="url"
                        id="buttonUrl"
                        className="form-control"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.example.com"
                    />
                </div>
                {error && <p style={{color: 'var(--danger-color)'}}>{error}</p>}
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem'}}>
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save Button</button>
                </div>
            </div>
        </div>
    );
};


const root = createRoot(document.getElementById('root')!);
root.render(<App />);
