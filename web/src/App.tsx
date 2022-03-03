import { useEffect } from 'react';
import './App.css';
import Unity, { UnityContext } from 'react-unity-webgl';
import Axios from 'axios';

const unityContext = new UnityContext({
    loaderUrl: 'game/cdkacha.loader.js',
    dataUrl: 'game/cdkacha.data',
    frameworkUrl: 'game/cdkacha.framework.js',
    codeUrl: 'game/cdkacha.wasm',
});

function App() {
    const startPull = async () => {
        try {
            const { data } = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/pull-character`);
            if (data && data.name) {
                unityContext.send('EventHandler', 'OnPullSuccess', data.name);
            } else unityContext.send('EventHandler', 'OnPullFail');
        } catch (err) {
            unityContext.send('EventHandler', 'OnPullFail');
        }
    }

    useEffect(function () {
        unityContext.on('canvas', function (canvas) {
            canvas.width = 1050;
            canvas.height = 600;
        });

        unityContext.on('StartPullRequest', () => {
            startPull();
        });
    }, []);

    useEffect(() => {
        const loadList = async () => {
            const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/list-characters`);
            console.log(data);
        };
        loadList();
    }, []);

    return (
        <div className="App">
            <Unity unityContext={unityContext} />
        </div>
    );
}

export default App;
