import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

const CLOCK_SIZE = 180;
const CLOCK_CENTER = CLOCK_SIZE / 2;

function getPoint(angleInDegrees: number, length: number) {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: CLOCK_CENTER + length * Math.cos(radians),
    y: CLOCK_CENTER + length * Math.sin(radians),
  };
}

type HandDot = {
  key: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

function buildHandDots(
  prefix: string,
  angleInDegrees: number,
  length: number,
  step: number,
  size: number,
  color: string
) {
  const dots: HandDot[] = [];
  for (let distance = 0; distance <= length; distance += step) {
    const point = getPoint(angleInDegrees, distance);
    dots.push({
      key: `${prefix}-${distance}`,
      x: point.x,
      y: point.y,
      size,
      color,
    });
  }
  return dots;
}

export function AnalogClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { hourDots, minuteDots, secondDots, digitalTime } = useMemo(() => {
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const hourAngle = hour * 30 + minute * 0.5;
    const minuteAngle = minute * 6 + second * 0.1;
    const secondAngle = second * 6;

    return {
      hourDots: buildHandDots('hour', hourAngle, 42, 3, 5, '#4b9ba3'),
      minuteDots: buildHandDots('minute', minuteAngle, 60, 3, 4, '#56bfc6'),
      secondDots: buildHandDots('second', secondAngle, 70, 4, 2, '#9ad5d9'),
      digitalTime: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }, [now]);

  return (
    <View className="items-center">
      <View className="relative h-[180px] w-[180px] rounded-full bg-[#E9F4F4] shadow-sm">
        <Text className="absolute left-[82px] top-2 text-base font-bold text-[#2ca8b1]">12</Text>
        <Text className="absolute right-2 top-[82px] text-base font-bold text-[#2ca8b1]">3</Text>
        <Text className="absolute bottom-2 left-[86px] text-base font-bold text-[#2ca8b1]">6</Text>
        <Text className="absolute left-2 top-[82px] text-base font-bold text-[#2ca8b1]">9</Text>

        {hourDots.map((dot) => (
          <View
            key={dot.key}
            className="absolute"
            style={{
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size / 2,
              left: dot.x - dot.size / 2,
              top: dot.y - dot.size / 2,
              backgroundColor: dot.color,
            }}
          />
        ))}
        {minuteDots.map((dot) => (
          <View
            key={dot.key}
            className="absolute"
            style={{
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size / 2,
              left: dot.x - dot.size / 2,
              top: dot.y - dot.size / 2,
              backgroundColor: dot.color,
            }}
          />
        ))}
        {secondDots.map((dot) => (
          <View
            key={dot.key}
            className="absolute"
            style={{
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size / 2,
              left: dot.x - dot.size / 2,
              top: dot.y - dot.size / 2,
              backgroundColor: dot.color,
            }}
          />
        ))}

        <View
          className="absolute h-3 w-3 rounded-full bg-brand-500"
          style={{ left: CLOCK_CENTER - 6, top: CLOCK_CENTER - 6 }}
        />
      </View>
      <Text className="mt-2 text-sm font-medium text-slate-500">{digitalTime}</Text>
    </View>
  );
}
