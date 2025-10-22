import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import MarketAnalysis from './pages/MarketAnalysis';
import About from './pages/About';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/news/:id" component={NewsDetail} />
                    <Route path="/market-analysis" component={MarketAnalysis} />
                    <Route path="/about" component={About} />
                </Switch>
                <Footer />
            </div>
        </Router>
    );
};

export default App;