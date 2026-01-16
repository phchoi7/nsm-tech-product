import React, { Component } from 'react';
import '../scss/ChatBot.scss';

class ChatBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      messages: [
        {
          role: 'system',
          content: 'You are NSM Tech Assistant, helping introduce Ng Siu Mui Secondary School tech TEAM projects. Answer questions about our NFC Smart Supermarket, WICO Korea Competition, Smart Health APP. Be encouraging and tech-savvy. Keep responses concise.'
        }
      ],
      input: '',
      isLoading: false
    };
    this.chatboxRef = React.createRef();
  }

  componentDidMount() {
    // Load chat history
    try {
      const saved = localStorage.getItem('nsmtechchat');
      if (saved) {
        const history = JSON.parse(saved);
        if (Array.isArray(history) && history.length > 1) {
          this.setState({ messages: history });
        }
      }
    } catch (e) {
      console.log('Unable to load chat history');
    }
  }

  toggleChat = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  addMessage = (role, content) => {
    this.setState(prevState => {
      const newMessages = [...prevState.messages, { role, content }];
      // Save to localStorage
      try {
        localStorage.setItem('nsmtechchat', JSON.stringify(newMessages));
      } catch (e) {
        console.log('Unable to save chat');
      }
      return { messages: newMessages };
    }, () => {
      // Scroll to bottom
      if (this.chatboxRef.current) {
        this.chatboxRef.current.scrollTop = this.chatboxRef.current.scrollHeight;
      }
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { input, isLoading } = this.state;
    const text = input.trim();

    if (!text || isLoading) return;

    // Quick responses
    if (/name|who are you/i.test(text)) {
      this.addMessage('user', text);
      setTimeout(() => this.addMessage('assistant', 'I am NSM Tech Assistant! 🤖 I can tell you about our amazing tech projects!'), 300);
      this.setState({ input: '' });
      return;
    }

    // Add user message
    this.addMessage('user', text);
    this.setState({ input: '', isLoading: true });

    const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';
    const API_KEY = 'sk-W1H3NBbxu6tGBH00HiqijocCC8a7P3NcjzzyG2x8Fs7cNRhN';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: this.state.messages.concat([{ role: 'user', content: text }]),
          temperature: 0.7
        })
      });

      const data = await res.json();

      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        this.addMessage('assistant', reply);
      } else {
        this.addMessage('assistant', 'Sorry, invalid response. Please try again.');
      }
    } catch (error) {
      console.error(error);
      this.addMessage('assistant', '❌ Connection error. Please check your network.');
    }

    this.setState({ isLoading: false });
  };

  render() {
    const { isOpen, messages, input, isLoading } = this.state;
    const displayMessages = messages.slice(1); // Skip system message

    return (
      <>
        {/* Floating AI Button */}
        <button 
          className={`ai-chat-toggle ${isOpen ? 'open' : ''}`}
          onClick={this.toggleChat}
          aria-label="Toggle AI Chat"
        >
          {isOpen ? (
            <span className="iconify" data-icon="mdi:close" data-inline="false"></span>
          ) : (
            <span className="iconify" data-icon="mdi:robot-excited" data-inline="false"></span>
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="ai-chat-container">
            <div className="ai-chat-header">
              <h3><span role="img" aria-label="robot">🤖</span> NSM Tech Assistant</h3>
              <p>Ask me about our projects!</p>
            </div>

            <div className="ai-chat-box" ref={this.chatboxRef}>
              {displayMessages.length === 0 ? (
                <div className="ai-welcome">
                  <span className="iconify" data-icon="mdi:robot-excited" data-inline="false" style={{fontSize: '60px', color: '#667eea'}}></span>
                  <p><span role="img" aria-label="wave">👋</span> Hello! I'm NSM Tech Assistant<br/>Ask me about our award-winning projects!</p>
                </div>
              ) : (
                displayMessages.map((msg, idx) => (
                  <div key={idx} className={`ai-msg-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}>
                    <div className="ai-msg">{msg.content}</div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="ai-msg-wrapper ai">
                  <div className="ai-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <form className="ai-input-area" onSubmit={this.handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => this.setState({ input: e.target.value })}
                placeholder="Ask about NFC Smart Supermarket..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </>
    );
  }
}

export default ChatBot;
