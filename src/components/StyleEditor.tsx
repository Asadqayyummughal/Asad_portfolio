import { useState, useEffect } from 'react';
import './StyleEditor.css';
import { Paintbrush, X, RotateCcw, Layout, Palette, Type, Check } from 'lucide-react';

interface StyleSettings {
  cardBorderRadius: number;
  cardBorderWidth: number;
  cardBorderColor: string;
  cardShadowSize: number;
  cardShadowColor: string;
  cardShadowOpacity: number;
  headingSize: number;
  bodySize: number;
  primaryColor: string;
  bgLight: string;
  bgWhite: string;
}

const defaultSettings: StyleSettings = {
  cardBorderRadius: 6,
  cardBorderWidth: 1,
  cardBorderColor: '#e0e0dc',
  cardShadowSize: 0,
  cardShadowColor: '#000000',
  cardShadowOpacity: 10,
  headingSize: 100,
  bodySize: 100,
  primaryColor: '#E8534A',
  bgLight: '#f2f2f0',
  bgWhite: '#ffffff',
};

const presets = [
  {
    name: 'Classic Coral',
    settings: defaultSettings,
  },
  {
    name: 'Modern Dark',
    settings: {
      ...defaultSettings,
      primaryColor: '#3498db',
      bgLight: '#1a1a1a',
      bgWhite: '#2c3e50',
      cardBorderColor: '#34495e',
      cardBorderRadius: 12,
    },
  },
  {
    name: 'Minimalist',
    settings: {
      ...defaultSettings,
      primaryColor: '#333333',
      bgLight: '#fafafa',
      bgWhite: '#ffffff',
      cardBorderWidth: 0,
      cardShadowSize: 4,
      cardShadowOpacity: 5,
    },
  }
];

const STORAGE_KEY = 'portfolio_style_settings';

const StyleEditor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'colors' | 'type'>('colors');
  const [settings, setSettings] = useState<StyleSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--card-radius', `${settings.cardBorderRadius}px`);
    root.style.setProperty('--card-border-width', `${settings.cardBorderWidth}px`);
    root.style.setProperty('--card-border-color', settings.cardBorderColor);
    
    const shadowR = parseInt(settings.cardShadowColor.slice(1, 3), 16);
    const shadowG = parseInt(settings.cardShadowColor.slice(3, 5), 16);
    const shadowB = parseInt(settings.cardShadowColor.slice(5, 7), 16);
    root.style.setProperty('--card-shadow', 
      `0 ${settings.cardShadowSize}px ${settings.cardShadowSize * 2}px rgba(${shadowR},${shadowG},${shadowB},${settings.cardShadowOpacity / 100})`
    );
    
    root.style.setProperty('--heading-scale', `${settings.headingSize / 100}`);
    root.style.setProperty('--body-scale', `${settings.bodySize / 100}`);
    root.style.setProperty('--coral', settings.primaryColor);
    root.style.setProperty('--bg-light', settings.bgLight);
    root.style.setProperty('--bg-white', settings.bgWhite);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  const applyPreset = (presetSettings: StyleSettings) => {
    setSettings(presetSettings);
  };

  const update = (key: keyof StyleSettings, value: number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    setIsAdmin(localStorage.getItem('portfolio_admin') === 'true');
  }, []);

  if (!isAdmin) return null;

  return (
    <>
      <button 
        className={`style-editor-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Paintbrush size={20} />
      </button>

      <div className={`style-editor-drawer ${isOpen ? 'open' : ''}`}>
        <div className="se-header">
          <div className="se-header-top">
            <h3 className="se-title">Visual Editor</h3>
            <button className="se-close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="se-tabs">
            <button 
              className={`se-tab ${activeTab === 'colors' ? 'active' : ''}`}
              onClick={() => setActiveTab('colors')}
            >
              <Palette size={16} /> Colors
            </button>
            <button 
              className={`se-tab ${activeTab === 'layout' ? 'active' : ''}`}
              onClick={() => setActiveTab('layout')}
            >
              <Layout size={16} /> Layout
            </button>
            <button 
              className={`se-tab ${activeTab === 'type' ? 'active' : ''}`}
              onClick={() => setActiveTab('type')}
            >
              <Type size={16} /> Type
            </button>
          </div>
        </div>

        <div className="se-content">
          {activeTab === 'colors' && (
            <div className="se-section animate-fade-in">
              <div className="se-group">
                <h4 className="se-group-label">Brand Colors</h4>
                <div className="se-control-row">
                  <span>Primary</span>
                  <input type="color" value={settings.primaryColor} onChange={e => update('primaryColor', e.target.value)} />
                </div>
                <div className="se-control-row">
                  <span>Background Light</span>
                  <input type="color" value={settings.bgLight} onChange={e => update('bgLight', e.target.value)} />
                </div>
                <div className="se-control-row">
                  <span>Surface Color</span>
                  <input type="color" value={settings.bgWhite} onChange={e => update('bgWhite', e.target.value)} />
                </div>
              </div>

              <div className="se-group">
                <h4 className="se-group-label">Quick Presets</h4>
                <div className="se-presets-grid">
                  {presets.map(p => (
                    <button 
                      key={p.name} 
                      className={`se-preset-btn ${settings.primaryColor === p.settings.primaryColor ? 'active' : ''}`}
                      onClick={() => applyPreset(p.settings)}
                    >
                      <div className="se-preset-preview" style={{ background: p.settings.primaryColor }}>
                        {settings.primaryColor === p.settings.primaryColor && <Check size={12} color="white" />}
                      </div>
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="se-section animate-fade-in">
              <div className="se-group">
                <h4 className="se-group-label">Card Appearance</h4>
                <div className="se-slider-control">
                  <div className="se-slider-info">
                    <span>Radius</span>
                    <span>{settings.cardBorderRadius}px</span>
                  </div>
                  <input type="range" min="0" max="30" value={settings.cardBorderRadius} onChange={e => update('cardBorderRadius', +e.target.value)} />
                </div>
                <div className="se-slider-control">
                  <div className="se-slider-info">
                    <span>Border</span>
                    <span>{settings.cardBorderWidth}px</span>
                  </div>
                  <input type="range" min="0" max="5" value={settings.cardBorderWidth} onChange={e => update('cardBorderWidth', +e.target.value)} />
                </div>
              </div>

              <div className="se-group">
                <h4 className="se-group-label">Elevation (Shadow)</h4>
                <div className="se-slider-control">
                  <div className="se-slider-info">
                    <span>Depth</span>
                    <span>{settings.cardShadowSize}px</span>
                  </div>
                  <input type="range" min="0" max="40" value={settings.cardShadowSize} onChange={e => update('cardShadowSize', +e.target.value)} />
                </div>
                <div className="se-slider-control">
                  <div className="se-slider-info">
                    <span>Opacity</span>
                    <span>{settings.cardShadowOpacity}%</span>
                  </div>
                  <input type="range" min="0" max="50" value={settings.cardShadowOpacity} onChange={e => update('cardShadowOpacity', +e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'type' && (
            <div className="se-section animate-fade-in">
              <div className="se-group">
                <h4 className="se-group-label">Typography Scale</h4>
                <div className="se-slider-control">
                  <div className="se-slider-info">
                    <span>Heading Size</span>
                    <span>{settings.headingSize}%</span>
                  </div>
                  <input type="range" min="80" max="130" value={settings.headingSize} onChange={e => update('headingSize', +e.target.value)} />
                </div>
                <div className="se-slider-control">
                  <div className="se-slider-info">
                    <span>Body Size</span>
                    <span>{settings.bodySize}%</span>
                  </div>
                  <input type="range" min="80" max="120" value={settings.bodySize} onChange={e => update('bodySize', +e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="se-footer">
          <button className="se-reset-btn" onClick={handleReset}>
            <RotateCcw size={14} /> Restore Defaults
          </button>
        </div>
      </div>
    </>
  );
};

export default StyleEditor;
