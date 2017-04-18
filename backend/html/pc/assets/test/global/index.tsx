import * as React from 'react';
import * as ReactDOM from 'react-dom';


export default class App extends React.Component<any, any> {
    render() {
        return (
            <section className='h100'>
            </section>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

