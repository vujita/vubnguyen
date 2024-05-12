import "./index.css";

import { createRoot } from "react-dom/client";

const root = document.getElementById("root")!;
const App = () => <div className="text-bold p-2 text-lg">{"Popup page, Coming soon!!!"}</div>;

createRoot(root).render(<App />);
