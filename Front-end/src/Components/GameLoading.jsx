import "../styles/GameLoading.css";

const GameLoading = () => {
  return (
    <div className="game-loading-screen">
      <div className="loader-content">
        <div className="spinner"></div>
        <h2>Entering Game World...</h2>
        <p>Loading your dashboard</p>
      </div>
    </div>
  );
};

export default GameLoading;
