import React, { Component } from "react";
import "../scss/ChatBot.scss";

class ChatBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      messages: [
        {
          role: "system",
          content:
            "You are NSM Tech Assistant for 天主教慈幼會伍少梅中學 (Salesians of Don Bosco Ng Siu Mui Secondary School) tech TEAM. You have comprehensive knowledge about our 8 award-winning projects and school background.\n\n🏫 SCHOOL INFO:\n• Name: 天主教慈幼會伍少梅中學 (Salesians of Don Bosco Ng Siu Mui Secondary School)\n• Led by Future Talent Academy, coordinated by Ms. Sally Tam (譚良蔚老師)\n• Teachers: Ms. Sally Tam, Mr. Matthew Choi (蔡文魁老師), Ms. Natalie Tang (鄧清嵐老師), Mr. Marco Wong (黃瑋俊老師)\n• Philosophy: 'Learning by Doing' - combining cutting-edge technology with humanistic care\n• Focus: Innovative technology solutions serving community needs\n\n🏆 8 PROJECTS (2024-2026):\n\n1. 👑 NFC Mei Kee Smart Supermarket (2024) - FLAGSHIP PROJECT\n   • NFC-based smart shopping system for elderly with visual impairment\n   • Teacher: Ms. Sally Tam | Students: Chow King Yuen, Chow Ching Kiu, Ho Kwok Wang, Mou Sun Yik Fan\n   • Awards: Merit Award (Greater Bay Area STEAM 2025), 3rd Place (EdCity Innovation 2025), Champion (PolyU Fun-Tech 2024/25)\n   • Tech: NFC, App Inventor, Python, AI\n\n2. Smart Learning Health APP (2026)\n   • Health education platform with AI chatbot, BMI calculator, quiz game\n   • Teacher: Ms. Sally Tam | Students: F.4-F.5 team\n   • Features: Health consultation, personalized recommendations, gamified learning\n   • Tech: Scratch, App Inventor, HTML/CSS, JavaScript\n\n3. IEEE TALE 2025 International Conference\n   • Invited to present at Macao Polytechnic University (Dec 4-7, 2025)\n   • Teacher: Ms. Sally Tam | Theme: Engineering Technology & STEAM Education\n   • Significance: International recognition of our NFC project\n\n4. 7th Greater Bay Area STEAM Excellence Awards 2025\n   • Merit Award - ICT Category (Secondary Division)\n   • Teacher: Ms. Sally Tam | Project: NFC Smart Supermarket\n   • Recognition: Innovative tech for social good, elderly care focus\n\n5. WICO Korea Competition (2024)\n   • Silver Award at Seoul World Invention Creativity Competition\n   • Teachers: Mr. Choi, Mr. Tang | Students: Hung Yin, Yu Tsz Hang, Wong Ngo Hin, Yip Wang Ban, Chow Ching Kiu\n   • Experience: International exchange, cross-cultural learning\n\n6. Glacier Conservation STEAM (2025)\n   • Will Legend 'Let the Glacier Cool' Programme - Finalist Award (Top 3)\n   • Teacher: Mr. Marco Wong | Students: Form 5 Biology\n   • Focus: Third Pole glacier conservation, climate solutions\n\n7. Farmunity STEAM Programme (2025)\n   • Smart hydroponic farming with Farmacy partnership\n   • Teacher: Mr. Marco Wong\n   • Impact: Indoor farming education, vegetable donation to low-income families\n\n8. Sustainable Development Ambassador (2025)\n   • 3 consecutive years - 'Sustainable Development Community Project Award'\n   • 28 students recognized as ambassadors over 3 years\n   • 2025: 'Devotion of Promotion of Sustainable Development Honour Award'\n   • Organizer: Environment and Ecology Bureau\n\nAnswer questions about ANY of these projects, our teachers, students, awards, technologies used, and our school's educational philosophy. Be encouraging, tech-savvy, and detailed when asked. Support both English and Chinese questions.",
        },
      ],
      input: "",
      isLoading: false,
    };
    this.chatboxRef = React.createRef();
  }

  componentDidMount() {
    // Load chat history
    try {
      const saved = localStorage.getItem("nsmtechchat");
      if (saved) {
        const history = JSON.parse(saved);
        if (Array.isArray(history) && history.length > 1) {
          this.setState({ messages: history });
        }
      }
    } catch (e) {
      console.log("Unable to load chat history");
    }
  }

  toggleChat = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  addMessage = (role, content) => {
    this.setState(
      (prevState) => {
        const newMessages = [...prevState.messages, { role, content }];
        // Save to localStorage
        try {
          localStorage.setItem("nsmtechchat", JSON.stringify(newMessages));
        } catch (e) {
          console.log("Unable to save chat");
        }
        return { messages: newMessages };
      },
      () => {
        // Scroll to bottom
        if (this.chatboxRef.current) {
          this.chatboxRef.current.scrollTop =
            this.chatboxRef.current.scrollHeight;
        }
      }
    );
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { input, isLoading } = this.state;
    const text = input.trim();

    if (!text || isLoading) return;

    // Quick responses
    if (/name|who are you/i.test(text)) {
      this.addMessage("user", text);
      setTimeout(
        () =>
          this.addMessage(
            "assistant",
            "I am NSM Tech Assistant! 🤖 I can tell you about our amazing tech projects!"
          ),
        300
      );
      this.setState({ input: "" });
      return;
    }

    // Add user message
    this.addMessage("user", text);
    this.setState({ input: "", isLoading: true });

    const API_URL = "https://api.chatanywhere.tech/v1/chat/completions";
    const API_KEY = "sk-W1H3NBbxu6tGBH00HiqijocCC8a7P3NcjzzyG2x8Fs7cNRhN";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: this.state.messages.concat([
            { role: "user", content: text },
          ]),
          temperature: 0.7,
        }),
      });

      const data = await res.json();

      if (data.choices && data.choices[0]) {
        const reply = data.choices[0].message.content;
        this.addMessage("assistant", reply);
      } else {
        this.addMessage(
          "assistant",
          "Sorry, invalid response. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      this.addMessage(
        "assistant",
        "❌ Connection error. Please check your network."
      );
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
          className={`ai-chat-toggle ${isOpen ? "open" : ""}`}
          onClick={this.toggleChat}
          aria-label="Toggle AI Chat"
        >
          {isOpen ? (
            <span
              className="iconify"
              data-icon="mdi:close"
              data-inline="false"
            ></span>
          ) : (
            <span
              className="iconify"
              data-icon="mdi:robot-excited"
              data-inline="false"
            ></span>
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="ai-chat-container">
            <div className="ai-chat-header">
              <h3>
                <span role="img" aria-label="robot">
                  🤖
                </span>{" "}
                NSM Tech Assistant
              </h3>
              <p>Ask me about our projects!</p>
            </div>

            <div className="ai-chat-box" ref={this.chatboxRef}>
              {displayMessages.length === 0 ? (
                <div className="ai-welcome">
                  <span
                    className="iconify"
                    data-icon="mdi:robot-excited"
                    data-inline="false"
                    style={{ fontSize: "60px", color: "#667eea" }}
                  ></span>
                  <p>
                    <span role="img" aria-label="wave">
                      👋
                    </span>{" "}
                    Hello! I'm NSM Tech Assistant
                    <br />
                    Ask me about our award-winning projects!
                  </p>
                </div>
              ) : (
                displayMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`ai-msg-wrapper ${
                      msg.role === "user" ? "user" : "ai"
                    }`}
                  >
                    <div className="ai-msg">{msg.content}</div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="ai-msg-wrapper ai">
                  <div className="ai-typing">
                    <span></span>
                    <span></span>
                    <span></span>
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
                {isLoading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        )}
      </>
    );
  }
}

export default ChatBot;
