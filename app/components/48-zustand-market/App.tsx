"use client";


import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import useMarketStore from './store'
import data from './data'
import MainContent from './MainContent'
import Header from './Header'

const App = () => {
    const { setProducts } = useMarketStore()
    const [showAlert, setShowAlert] = useState(true)

    useEffect(() => {
        try {
            setProducts(data)
        } catch (error) {
            console.log(error)
        }
    }, [setProducts])
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 overflow-y-auto">
                    {showAlert && (
                        <div className="alert alert-info mb-4">
                            Welcome to the Zustand Market!
                            <span
                                className="alert-close"
                                onClick={() => setShowAlert(false)}
                            >
                                &times;
                            </span>
                        </div>
                    )}
                    <MainContent />
                </main>
            </div>
        </div>
    )
}

export default App
