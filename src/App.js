import React, { useState } from 'react';
import './App.css';
import { Button, Card, Form } from 'react-bootstrap';
import LoadingPage from './loading/LoadingPage'
import OpenAI from 'openai';
import { FaMicrophone } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";

function App() {
  const openai = new OpenAI({apiKey:`${process.env.REACT_APP_OPENAI_API_KEY}`, dangerouslyAllowBrowser: true})
  const tts_url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.REACT_APP_JAPANESE_ACCENT}`;
  const tts_url_foreign = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.REACT_APP_JAPANESE_VOICE}`;
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [gptGeneratedResponse, setGptGeneratedResponse] = useState(null);
  const [gptGeneratedJapaneseResponse, setGptGeneratedJapaneseResponse] = useState(null);
  const [recording, setRecording] = useState(false);
  let recognition = null;
  const handleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTextInput(transcript);
      };
      if (!recording) {
        recognition.start();
        setRecording(true);
      } else {
        recognition.stop();
        setRecording(false);
      }
    }
  };
  
  const handleSubmitText = async (e) => {
    e.preventDefault();
    if(textInput.length < 1) {
      return
    }
    try {
      setLoading(true);
      await generateGPTResponse(textInput);
      await generateJapaneseGPTResponse(textInput);
    } catch (error) {
      console.error(error)
    }
  };
  // this is the brain of Tokugawa Ieyasu
  const generateGPTResponse = async (textInput) => {
    try {
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `
                Reply to this as Tokugawa Ieyasu maintain the authoritative, warlike, but respectful tone associated with Tokugawa Ieyasu. Keep your response to a single paragraph.
                `
            },
            {
                role: 'user',
                content: `
                    ${textInput}.
                `
            }
        ],
        temperature: 0.6,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: "{}",
    });
    setLoading(false);
    setGptGeneratedResponse(gptResponse.choices[0].message.content);
    } catch (error) {
      console.error(error)
    }
  };
  const generateJapaneseGPTResponse = async (textInput) => {
    try {
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `
                Reply to this in japanese as Tokugawa Ieyasu maintain the authoritative, warlike, but respectful tone associated with Tokugawa Ieyasu. Keep your response to a single paragraph.
                `
            },
            {
                role: 'user',
                content: `
                    ${textInput}.
                `
            }
        ],
        temperature: 0.6,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: "{}",
    });
    setLoading(false);
    setGptGeneratedJapaneseResponse(gptResponse.choices[0].message.content);
    } catch (error) {
      console.error(error)
    }
  };

  // download
  const handleTheVoiceOfTokugawaIeyasusEnglishDownload = () => {
    if (!gptGeneratedResponse) {
      console.error('No generated response to convert to speech');
      return;
    }
    setLoading(true)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': `${process.env.REACT_APP_ELEVENLABS_API_KEY}`
      },
      body: JSON.stringify({
        "model_id": "eleven_multilingual_v2",
        "text": gptGeneratedResponse,
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.75,
          "style": 0.0,
          "use_speaker_boost": true
        }
      })
    };
  
    fetch(tts_url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.mp3');
      document.body.appendChild(link);
      link.click();
      setLoading(false)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  const handleTheVoiceOfTokugawaIeyasusJapaneseDownload = () => {
    if (!gptGeneratedJapaneseResponse) {
      console.error('No generated response to convert to speech');
      return;
    }
    setLoading(true)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': `${process.env.REACT_APP_ELEVENLABS_API_KEY}`
      },
      body: JSON.stringify({
        "model_id": "eleven_multilingual_v2",
        "text": gptGeneratedJapaneseResponse,
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.75,
          "style": 0.0,
          "use_speaker_boost": true
        }
      })
    };
  
    fetch(tts_url_foreign, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.mp3');
      document.body.appendChild(link);
      link.click();
      setLoading(false)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  // playback
  const handleTheVoiceOfTokugawaIeyasusEnglish = () => {
    if (!gptGeneratedResponse) {
      console.error('No generated response to convert to speech');
      return;
    }
    setLoading(true)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': `${process.env.REACT_APP_ELEVENLABS_API_KEY}`
      },
      body: JSON.stringify({
        "model_id": "eleven_multilingual_v2",
        "text": gptGeneratedResponse,
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.75,
          "style": 0.0,
          "use_speaker_boost": true
        },
        "output_format": "mp3_44100_192" 
      })
    };
  
    fetch(tts_url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const audioElement = new Audio(url);
        setLoading(false)
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const handleTheVoiceOfTokugawaIeyasusJapanese = () => {
    if (!gptGeneratedJapaneseResponse) {
      console.error('No generated response to convert to speech');
      return;
    }
    setLoading(true)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': `${process.env.REACT_APP_ELEVENLABS_API_KEY}`
      },
      body: JSON.stringify({
        "model_id": "eleven_multilingual_v2",
        "text": gptGeneratedJapaneseResponse,
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.75,
          "style": 0.0,
          "use_speaker_boost": true
        },
        "output_format": "mp3_44100_192" 
      })
    };
  
    fetch(tts_url_foreign, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const audioElement = new Audio(url);
        setLoading(false)
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  

  return (
    <>
    {loading && (
      <LoadingPage />
    )}
    <div className='pageWrapper'>
      <h1>Tokugawa Ieyasus</h1>
      <Card className='inputAndOutputCard'>
        <Card.Header>
          Input choices
        </Card.Header>
        <Card.Body>
          <div className='cardInnerDiv'>
            <div className='cardLeftDiv'>
              <Form>
                <Form.Label>
                  Text Input {textInput.length}/500
                  </Form.Label>
                <Form.Control 
                as='textarea'
                maxLength={500}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                />
              </Form>
              <Button 
              onClick={(e) => 
              handleSubmitText(e)
              }
              >
                Submit
              </Button>
            </div>
            {/* user audio input */}
            <div className='cardRightDiv'>
              <div>
                <div 
                className='micDiv'
                >
                  {!recording ? (
                    <FaMicrophone 
                    size={50} 
                    className='micIcon'
                    onClick={() => {handleListening()}}
                    />
                  ) : (
                    <ImCancelCircle 
                    size={50} 
                    className='cancelIcon'
                    onClick={() => {handleListening()}}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className='responseWrap'>
        <Card className='inputAndOutputCard'>
          <Card.Header>
            English Response
          </Card.Header>
          <Card.Body>
          {gptGeneratedResponse && (
            <>
            <h5>Tokugawa Ieyasus</h5>
            {gptGeneratedResponse}
            <br/>
            <div className='cardButtonGroup'>
              <Button onClick={handleTheVoiceOfTokugawaIeyasusEnglish}>
                Listen
              </Button>
              <Button onClick={handleTheVoiceOfTokugawaIeyasusEnglishDownload}>
                Download
              </Button>
            </div>
            </>
            )}
          </Card.Body>
        </Card>
        <Card className='inputAndOutputCard'>
          <Card.Header>
            Japanese Response
          </Card.Header>
          <Card.Body>
          {gptGeneratedJapaneseResponse && (
            <>
            <h5>徳川家康</h5>
            {gptGeneratedJapaneseResponse}
            <br/>
            <div className='cardButtonGroup'>
              <Button onClick={handleTheVoiceOfTokugawaIeyasusJapanese}>
                Listen
              </Button>
              <Button onClick={handleTheVoiceOfTokugawaIeyasusJapaneseDownload}>
                Download
              </Button>
            </div>
            </>
            )}
          </Card.Body>
        </Card>
      </div>
    </div> 
    </>
  );
}

export default App;