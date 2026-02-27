import React, { Component } from 'react';

class GoogleAds extends Component {

    componentDidMount() {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    render() {
        return (
            <ins className='adsbygoogle'
                style={{ display: 'block', width: '300px', height: '500px', zIndex: '100000000' }}
                data-ad-client='ca-pub-3330889871238840'
                data-ad-slot={this.props.slot}
                data-ad-format='auto'
                data-full-width-responsive="true"
            >
            </ins>
        );
    }
}

export default GoogleAds;