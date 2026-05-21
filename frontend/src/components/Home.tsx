export type CookingStage = 'idle' | 'prepping' | 'cooking' | 'serving';

export type CookingSystemState = {
  selectedSushiId: number | null;
  cookingQueue: number[];
  chefEnergy: number;
  stage: CookingStage;
  cookedCount: number;
};

type HomeProps = {
  cookingState: CookingSystemState;
  setCookingState: (state: CookingSystemState) => void;
};

export default function Home({ cookingState, setCookingState }: HomeProps) {
  return (
    <section className="home-panel">
      <div className="home-stats">
        <span>Stage: {cookingState.stage}</span>
        <span>Energy: {cookingState.chefEnergy}</span>
        <span>Cooked: {cookingState.cookedCount}</span>
      </div>
      <button
        type="button"
        onClick={() =>
          setCookingState({
            ...cookingState,
            stage: cookingState.stage === 'idle' ? 'prepping' : cookingState.stage,
          })
        }
      >
        Start Cooking
      </button>
    </section>
  );
}
