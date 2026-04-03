import type { Challenge } from '../../data/types';
import zacjakeSad from '../../assets/images/illo-zacjake.gif';
import zacjakeHappy from '../../assets/images/illo-zacjake-2.gif';
import star from '../../assets/images/illo-star.gif';

interface OutOfTimeProps {
  challenge: Challenge;
}

export function OutOfTime({ challenge }: OutOfTimeProps) {
  const isHappy = challenge.happyResponse;

  return (
    <div className="flex flex-col items-center py-6 px-4" role="alert">
      <h1 className="text-4xl md:text-6xl font-[8008135] text-center mb-6">Out of time!</h1>
      <div className="max-w-md w-full">
        <img
          src={isHappy ? zacjakeHappy : zacjakeSad}
          alt={isHappy ? 'Zac and Jake celebrating' : 'Zac and Jake disappointed'}
          className="mb-4 w-full"
        />
        <div className="talk-bubble p-3">
          <div className="talk-bubble-arrow" />
          {isHappy ? (
            <p className="mb-0">
              We really think <strong>{challenge.audience}</strong> would love this thing! We award you 3 stars!
            </p>
          ) : (
            <p className="mb-0">
              Do you really think <strong>{challenge.audience}</strong> would use that crappy thing? We award you 0 Stars!
            </p>
          )}
        </div>
        {isHappy && (
          <p className="text-center mt-3">
            <img src={star} width={64} alt="Star" className="inline" />
            <img src={star} width={64} alt="Star" className="inline" />
            <img src={star} width={64} alt="Star" className="inline" />
          </p>
        )}
      </div>
    </div>
  );
}
