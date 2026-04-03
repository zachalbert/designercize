import star from '../../assets/images/illo-star.gif';
import zac from '../../assets/images/illo-zac.gif';
import jake from '../../assets/images/illo-jake.gif';
import logoMezzo from '../../assets/images/logo-mezzo.svg';

interface AboutContentProps {
  onBack: () => void;
}

export function AboutContent({ onBack }: AboutContentProps) {
  return (
    <div className="max-w-3xl mx-auto" style={{ padding: 'var(--space-screen-padding)' }}>
      {/* Header */}
      <div className="flex items-center justify-center gap-4 py-3 mb-8 border-2 border-[var(--color-crt-text)]">
        <img src={star} width={48} alt="" className="hidden sm:block" />
        <h1 className="font-weight-fat text-center" style={{ fontSize: '2rem' }}>Designer, challenge thyself</h1>
        <img src={star} width={48} alt="" className="hidden sm:block" />
      </div>

      {/* Stay up to date */}
      <h3 className="font-weight-fat text-center mb-4" style={{ fontSize: '1.1rem' }}>Stay up to date:</h3>
      <div className="flex justify-center mb-8">
        <form action="https://mezzotent.us17.list-manage.com/subscribe/post" method="post" className="flex gap-2">
          <input
            type="email"
            name="EMAIL"
            placeholder="E-mail"
            className="bg-transparent border-b-2 border-[var(--color-crt-text)] text-[var(--color-crt-text)] px-2 py-1 outline-none font-[8008]"
          />
          <button type="submit" className="border-2 border-[var(--color-crt-text)] text-[var(--color-crt-text)] px-4 py-1 bg-transparent font-[8008] cursor-pointer hover:bg-[var(--color-crt-text)] hover:text-[var(--color-crt-dark)] transition-colors">
            Subscribe
          </button>
        </form>
      </div>

      {/* Benefits */}
      <h3 className="font-weight-fat mb-4" style={{ fontSize: '1.3rem' }}>Just 15 Minutes a day gives you:</h3>
      <ul className="list-disc list-inside space-y-1 mb-6">
        <li>Better design thinking</li>
        <li>Faster design decisions</li>
        <li>More dates with attractive people</li>
        <li>Mastery of the whiteboard</li>
        <li>Dynamite interview skills</li>
        <li>Happiness and success in all your endeavors</li>
      </ul>
      <p className="mb-4">
        Works best with a friend and a whiteboard, but you can designercize on a screen too.
        Keep challenges short enough to complete over your lunch break. Do one every day for best results.
      </p>
      <p className="mb-6">
        Here's{' '}
        <a href="https://medium.com/@teachang/the-beginners-guide-to-the-whiteboard-challenge-538289536a72" target="_blank" rel="noopener noreferrer">
          an instruction manual (v: @teachang + @_echoi_)
        </a>
        , based on the{' '}
        <a href="https://medium.com/@mollyinglish/the-ninja-skill-for-ux-designers-25f314f8f76c" target="_blank" rel="noopener noreferrer">
          original instruction manual (v: @mollyinglish)
        </a>.
      </p>

      {/* Origin Story */}
      <h3 className="font-weight-fat mt-8 mb-4" style={{ fontSize: '1.3rem' }}>Origin story</h3>
      <p className="mb-6">
        Designercize is a digital version of an analog whiteboard exercise originally
        created by <a href="https://twitter.com/katerutter" target="_blank" rel="noopener noreferrer">Kate Rutter</a> and{' '}
        <a href="https://twitter.com/lauraklein" target="_blank" rel="noopener noreferrer">Laura Klein</a> to help designers improve
        whiteboarding, interviewing, and design thinking skills. It's been honed over
        thousands of practice sessions with <a href="https://www.tradecraft.com/" target="_blank" rel="noopener noreferrer">Tradecraft</a> designers.
      </p>

      {/* Colophon */}
      <h3 className="font-weight-fat mt-8 mb-4" style={{ fontSize: '1.3rem' }}>Colophon</h3>
      <p className="mb-6">
        The designercize app was created by Tradecraft design instructors{' '}
        <a href="https://twitter.com/zachalbert" target="_blank" rel="noopener noreferrer">Zac</a> &amp;{' '}
        <a href="https://twitter.com/jakeflem" target="_blank" rel="noopener noreferrer">Jake</a>, because we &lt;3 you.
        Bespoke fonts, handcrafted by Jake, are obtainable <a href="https://gum.co/8008" target="_blank" rel="noopener noreferrer">here</a>.
      </p>

      {/* Creators */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <img src={zac} alt="Zac Halbert" className="w-24 flex-shrink-0" />
        <div className="text-center sm:text-left">
          <h3 className="font-weight-fat">
            <a href="https://twitter.com/zachalbert" target="_blank" rel="noopener noreferrer">Zac Halbert</a>
          </h3>
          <p>"All that to say, this is bad."</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <img src={jake} alt="Jake Fleming" className="w-24 flex-shrink-0" />
        <div className="text-center sm:text-left">
          <h3 className="font-weight-fat">
            <a href="https://twitter.com/jakeflem" target="_blank" rel="noopener noreferrer">Jake Fleming</a>
          </h3>
          <p>"Uh, no. Bad. Bad design."</p>
        </div>
      </div>

      {/* Special Thanks */}
      <h3 className="font-weight-fat mt-8 mb-4" style={{ fontSize: '1.3rem' }}>Special thanks</h3>
      <p className="mb-6">
        Inspired by <a href="http://typecooker.com/" target="_blank" rel="noopener noreferrer">TypeCooker</a>.
        Engineering support by <a href="https://www.linkedin.com/in/patrick-burd-331a4887/" target="_blank" rel="noopener noreferrer">Patrick Burd</a>,
        writing + comedic support by Megan Kard,
        and early explorations by <a href="http://jonathankuei.com/" target="_blank" rel="noopener noreferrer">Jonathan Kuei</a>.
        And a special thanks to all the guinea pig beta testers in the Tradecraft design community.
      </p>

      <div className="text-center my-6">- - - &bull; &bull;&nbsp;&nbsp;- - - &bull; &bull;</div>

      <h2 className="font-weight-fat text-center mb-2">A thing by:</h2>
      <p className="text-center mb-6">
        <a href="https://mezzotent.com/" target="_blank" rel="noopener noreferrer">
          <img src={logoMezzo} alt="Mezzotent" width={224} />
        </a>
      </p>

      <div className="text-center my-6">- - - &bull; &bull;&nbsp;&nbsp;- - - &bull; &bull;</div>

      <div className="text-center mb-6">
        <button
          type="button"
          onClick={onBack}
          className="font-weight-fat text-[var(--color-crt-text)] hover:underline bg-transparent border-none cursor-pointer"
          style={{ fontSize: '1.1rem' }}
        >
          &larr; Back to Designercize
        </button>
      </div>
    </div>
  );
}
