import React, { Component } from 'react'

import ScrollContainer from 'react-indiana-drag-scroll'

function Categories() {
    return (<ScrollContainer className="scroll-container scrollH">
        <div className='context'>Ação</div>
        <div className='context'>Comedia</div>
        <div className='context'>Sci-fi</div>
        <div className='context'>Aventura</div>
        <div className='context'>Drama</div>
        <div className='context'>Romance</div>
        <div className='context'>Horror</div>
        <div className='context'>Seinen</div>
        <div className='context'>Shonen</div>
        <div className='context'>Isekai</div>
        <div className='context'>Mecha</div>
        <div className='context'>Josei</div>
      </ScrollContainer>)
    
}

export default Categories