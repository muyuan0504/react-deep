import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

import Home from '@/pages/home'
import PageA from '@/pages/pageA'

export default function MyApp() {
    /** HashRouter的使用 */
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='pageA' element={<PageA />} />
            </Routes>
        </HashRouter>
    )
}
