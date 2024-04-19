import React from 'react'
import Typewriter from 'typewriter-effect';
import Servo from '../static/samurai wallpaper.gif'
import './loadingPage.css'
export default function LoadingPage() {
  const phrases = [
    'Bushi no ichigon - The way of the warrior is found in death',
    'Kansha no kotoba - Words of gratitude.',
    'Bushi no tamashii - The spirit of the warrior.',
    'Wakon yosai - Japanese spirit, Western technology.',
    'Tenka fubu - Rule the empire through military force.',
    'Shogun no kokoro - Heart of the shogun.',
    'Bunbu ryodo - The harmony of pen and sword',
    'Fudoshin - Immovable mind.',
    'Kachigumi, makegumi - Winners and losers.',
    'Seishin teki kyoyo - Spiritual refinement.'
  ];
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  return (
    <div className='loadingPageWrapper'>
        <div>
        <img src={Servo} alt='a gif of a Samurai' id='loadingGif'/>
            <Typewriter
            options={{
                strings: shuffleArray(phrases),
                autoStart: true,
                loop: true,
            }}
            />
        </div>
    </div>
  )
}