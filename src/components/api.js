import React from 'react';

class List extends React.Component {
    state = {
        linguagens: []
    };

    componentDidMount() {
        fetch('https://q4l8x4.deta.dev/recent')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    linguagens: res
                });
            });
    }

    render() {
        return (
        <div className="Container" id="Container">
            <h1>Últimos Mangás adicionados</h1>

                    {this.state.linguagens.map(item => (
                        <div className="itemC" key={item.id}>
                      <img alt='logo' src={item.image}/>
                       <div className="textsC">
                      <h3>{item.title}</h3>
                           <h4>{item.author}</h4>
                           <a className="cap" href='home'>Capitulo: {item.chapters_count}</a>
            <div className="config">
            <div className="cat">
            <a className="at" href='home'><span role="img" aria-label=''>⭐{item.score}</span> </a>
                <h5>{item.categories[1]}</h5>
                <h5>{item.categories[2]}</h5>
                <h5>{item.categories[3]}</h5>
            </div></div>
                        </div></div>
                    ))}
        </div>

            
        );

    }
}

export default List;