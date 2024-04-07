import './App.css';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

 function App() {
  const dashboardRef = useRef([]);
  const [dashboardId, setDashboardId] = useState('4568de17-7d73-44ff-8485-28ed0cd72728');
  const [embeddedDashboard, setEmbeddedDashboard] = useState(null);
  const [dashboardUrl, setDashboardUrl] = useState(null);
  const [embeddingContext, setEmbeddingContext] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
           
      fetch("https://h4eu49apc2.execute-api.ap-northeast-1.amazonaws.com/embed/anonymous-embed"
      ).then((response) => response.json()
      ).then((response) => {
        setDashboardUrl(response.EmbedUrl)
      })
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  const createContext = async () => {
    const context = await createEmbeddingContext();
    setEmbeddingContext(context);
  }

  useEffect(() => {
    if (dashboardUrl) { createContext() }
  }, [dashboardUrl])

  useEffect(() => {
    if (embeddingContext) { embed(); }
  }, [embeddingContext])

  const embed = async () => {

    const options = {
      url: dashboardUrl,
      container: dashboardRef.current,
      height: "500px",
      width: "600px",
    };

    const newEmbeddedDashboard = await embeddingContext.embedDashboard(options);
    setEmbeddedDashboard(newEmbeddedDashboard);
  };

  useEffect(() => {
    if (embeddedDashboard) {
      embeddedDashboard.navigateToDashboard(dashboardId, {})
    }
  }, [dashboardId])

  const changeDashboard = async (e) => {
    const dashboardId = e.target.value
    setDashboardId(dashboardId)
  }

  return (
    <>
      <header>
        <h1>Embedded <i>QuickSight</i>: Build Powerful Dashboards in React</h1>
      </header>
      <main>
        <p>Welcome to the QuickSight dashboard embedding sample page</p>
        <p>Please pick a dashboard you want to render</p>
        <select id='dashboard' value={dashboardId} onChange={changeDashboard}>
          <option value="4568de17-7d73-44ff-8485-28ed0cd72728">YOUR_DASHBOARD1_NAME</option>
          <option value="4568de17-7d73-44ff-8485-28ed0cd72728">YOUR_DASHBOARD2_NAME</option>
        </select>
        <div ref={dashboardRef} />
      </main>
    </>
  );
};

export default App