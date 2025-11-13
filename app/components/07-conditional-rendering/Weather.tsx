interface WeatherProps {
  temperature: number;
}

const Weather = (props: WeatherProps) => {
  if (props.temperature < 15) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border-2 border-[var(--primary)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-xl font-semibold text-[var(--primary)] center-text">
            It&apos;s cold outside! ❄️
          </p>
        </div>
      </div>
    );
  } else if (props.temperature >= 15 && props.temperature <= 25) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border-2 border-[var(--accent)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-xl font-semibold text-[var(--accent)] center-text">
            It&apos;s nice outside! ☀️
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border-2 border-[var(--secondary)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-xl font-semibold text-[var(--secondary)] center-text">
            It&apos;s hot outside! 🔥
          </p>
        </div>
      </div>
    );
  }
};

export default Weather;
