interface WeatherProps {
  temperature: number;
}

const Weather = (props: WeatherProps) => {
  if (props.temperature < 15) {
    return <div className="p-4 border border-blue-300 rounded-lg mt-4 bg-blue-50"><p className="text-blue-800">It's cold outside!</p></div>;
  } else if (props.temperature >= 15 && props.temperature <= 25) {
    return <div className="p-4 border border-green-300 rounded-lg mt-4 bg-green-50"><p className="text-green-800">It's nice outside!</p></div>;
  } else {
    return <div className="p-4 border border-red-300 rounded-lg mt-4 bg-red-50"><p className="text-red-800">It's hot outside!</p></div>;
  }
};

export default Weather;
