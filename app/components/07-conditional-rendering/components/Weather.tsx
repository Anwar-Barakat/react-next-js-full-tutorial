interface WeatherProps {
  temperature: number;
}

const Weather = (props: WeatherProps) => {
  if (props.temperature < 15) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full glass border-glass-border rounded-lg p-6 md:p-8">
          <p className="text-xl font-semibold text-primary center-text">
            It&apos;s cold outside! ❄️
          </p>
        </div>
      </div>
    );
  } else if (props.temperature >= 15 && props.temperature <= 25) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full glass border-glass-border rounded-lg p-6 md:p-8">
          <p className="text-xl font-semibold text-accent center-text">
            It&apos;s nice outside! ☀️
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full glass border-glass-border rounded-lg p-6 md:p-8">
          <p className="text-xl font-semibold text-secondary center-text">
            It&apos;s hot outside! 🔥
          </p>
        </div>
      </div>
    );
  }
};

export default Weather;
