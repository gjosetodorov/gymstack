import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GymStackLogo from "./GymStack.png";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);

const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
if (favicon) {
  favicon.href = GymStackLogo;
} else {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = GymStackLogo;
  document.head.appendChild(link);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
