import React, { useState, useEffect, useContext, createContext } from "react";

const ThemeContext = createContext();

function useTheme() {
  return useContext(ThemeContext);
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition">
      Переключить тему: {theme === "light" ? "Светлая" : "Тёмная"}
    </button>
  );
}

export default function TimerApp() {
  const [name, setName] = useState(() => localStorage.getItem("username") || "");
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [motivationalPhrase, setMotivationalPhrase] = useState("");
  const [completions, setCompletions] = useState(() => Number(localStorage.getItem("completions")) || 0);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const phrases = [
    "Ты сделал это отлично!",
    "Крутая работа!",
    "Сильный фокус, молодец!",
    "Ты не сдаёшься — это вдохновляет!",
    "Каждый шаг — это прогресс!",
    "🔥 Пламя в глазах, молодец!",
    "🚀 Ты на взлётной полосе успеха!",
    "🌟 Блестящий результат!"
  ];

  useEffect(() => {
    localStorage.setItem("username", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsFinished(true);
      setIsRunning(false);
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      setMotivationalPhrase(randomPhrase);
      const updatedCompletions = completions + 1;
      setCompletions(updatedCompletions);
      localStorage.setItem("completions", updatedCompletions);

      alert("🎉 Таймер завершён!");
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (!name.trim()) return alert("Введите имя!");
    setTimeLeft(duration);
    setIsRunning(true);
    setIsFinished(false);
    setMotivationalPhrase("");
  };

  const reset = () => {
    setName("");
    setTimeLeft(0);
    setIsRunning(false);
    setIsFinished(false);
    setMotivationalPhrase("");
    setDuration(10);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const progressPercent = ((duration - timeLeft) / duration) * 100;

  const themeStyles = theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"} min-h-screen flex flex-col`}>
        <header className="p-4 text-xl font-bold text-orange-600">dingaidarbek</header>
        <main className="flex-grow flex justify-center items-center">
          <div className={`p-6 max-w-md w-full rounded-2xl shadow ${themeStyles} border border-orange-200`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-orange-500">Таймер 💻</h2>
              <ThemeToggle />
            </div>
            <p className="text-sm text-orange-500 mb-4 text-center">Завершено таймеров: {completions}</p>

            {!isRunning && !isFinished && (
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="Введите имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2 border border-orange-300 rounded mb-2 text-center ${
                    theme === "dark" ? "bg-gray-800 text-white placeholder-gray-400" : "bg-white text-black"
                  }`}
                />
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={`w-full p-2 border border-orange-300 rounded mb-4 text-center ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                  }`}
                >
                  <option value={10}>10 секунд</option>
                  <option value={20}>20 секунд</option>
                  <option value={30}>30 секунд</option>
                </select>
              </div>
            )}

            {isRunning && (
              <div className="flex flex-col items-center">
                <p className="text-xl mb-2 text-center">
                  {name || "Имя"}, осталось {timeLeft} сек
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {isFinished && (
              <div className="mb-4 text-center">
                <p className="text-xl font-semibold text-orange-500 mb-2">
                  Ты справился, {name} 💪
                </p>
                <p className="text-lg italic text-orange-400">{motivationalPhrase}</p>
              </div>
            )}

            <div className="flex justify-center gap-2">
              {!isRunning && !isFinished && (
                <button
                  onClick={startTimer}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition disabled:opacity-50"
                  disabled={isRunning}
                >
                  Старт таймера
                </button>
              )}

              {isFinished && (
                <button
                  onClick={startTimer}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  Попробовать ещё раз
                </button>
              )}

              <button
                onClick={reset}
                className="bg-orange-200 text-orange-700 px-4 py-2 rounded hover:bg-orange-300 transition"
              >
                Сброс
              </button>
            </div>
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
