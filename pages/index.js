// import {useEffect, useRef, useState} from "react";
// import {console} from "next/dist/compiled/@edge-runtime/primitives/console";
//
// export default function Home() {
//     const [open, setOpen] = useState(false)
//     const [sheetHeight, setSheetHeight] = useState(50)
//     const [dragPosition, setDragPosition] = useState(undefined)
//     const [dragging, setDragging] = useState(false)
//     const [isFullScreen, setIsFullScreen] = useState(false)
//     const sheet = useRef(null);
//     const touchPosition = (event) => {
//         return event.touches ? event.touches[0] : event
//     }
//
//
//     const onDragStart = (event) => {
//         setDragging(true)
//         console.log(touchPosition(event).pageY)
//         setDragPosition(touchPosition(event).pageY)
//     }
//
//     const setHeight = (value) => {
//         console.log("VALUE", value)
//         setSheetHeight(Math.max(0, Math.min(100, value)))
//         if (sheetHeight === 100) {
//             setIsFullScreen(true)
//         } else {
//             setIsFullScreen(false)
//         }
//     }
//
//     const onDragMove = (event) => {
//         console.log("dragPosition", dragPosition)
//         if (dragPosition === undefined) return
//         // console.log(event.pageY, dragPosition)
//         const y = touchPosition(event).pageY
//         const deltaY = dragPosition - y
//
//         const deltaHeight = deltaY / window.innerHeight * 100
//         // console.log(sheetHeight, sheetHeight + deltaHeight)
//         setSheetHeight(prev => Math.max(0, Math.min(100, prev + deltaHeight)))
//         if (sheetHeight === 100) {
//             setIsFullScreen(true)
//         } else {
//             setIsFullScreen(false)
//         }
//         setDragPosition(y)
//     }
//     const setIsSheetShown = (value) => {
//         setOpen(value)
//     }
//
//     const onDragEnd = () => {
//         setDragPosition(undefined)
//         if (sheetHeight < 25) {
//             setIsSheetShown(false)
//         } else if (sheetHeight > 75) {
//             setHeight(100)
//         } else {
//             setHeight(50)
//         }
//     }
//     useEffect(() => {
//         window.addEventListener("mousemove", onDragMove)
//         window.addEventListener("touchmove", onDragMove)
//
//         window.addEventListener("mouseup", onDragEnd)
//         window.addEventListener("touchend", onDragEnd)
//         //Clean up function
//         return () => {
//             window.removeEventListener("mousemove", onDragMove)
//             window.removeEventListener("touchmove", onDragMove)
//
//             window.removeEventListener("mouseup", onDragEnd)
//             window.removeEventListener("touchend", onDragEnd)
//         }
//     }, [])
//
//     return (
//         <div
//             className={`h-screen w-screen bg-black text-white p-10 overflow-hidden`}>
//             <button type="button" id="open-sheet" aria-controls="sheet"
//                     className={"bg-gray-100 text-black px-5 py-3 rounded-md font-bold"}
//                     onClick={() => {
//                         setSheetHeight(Math.min(50, 720/window.innerHeight * 100))
//                         setOpen(true)
//                     }}>
//                 Open Sheet
//             </button>
//
//             {/*Sheet*/}
//             <div
//                 ref={sheet}
//                 className={`fixed top-0 left-0 right-0 bottom-0 z-10 visible transition ease-in-out transition-opacity transform transition-transform transition-opacity ${!open ? "opacity-0 hidden pointer-none translate-y-full" : "translate-y-0"} flex flex-col justify-end items-center`}>
//                 {/*Overlay*/}
//                 <div className="absolute top-0 left-0 right-0 bottom-0 -z-10 bg-gray-100 opacity-50" onClick={() => setIsSheetShown(false)}></div>
//                 {/*Contents*/}
//                 <div
//                     style={{height: `${sheetHeight}vh`}}
//                     className={`${isFullScreen ? "rounded-none" : "rounded-t-xl"} ${dragging ? "not-selectable" : ""} transform transition transition-transform relative max-w-7xl bg-black overflow-y-hidden transition max-h-screen box-border p-4 pt-12 flex flex-col ${!open ? "transform translate-y-full" : ""}`}
//                 >
//                     <header className="mb-6">
//                         <div
//                             className={`absolute top-0 left-0 right-0 w-12 m-auto bg-red-200 p-4 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
//                             onMouseDown={onDragStart} onTouchStart={onDragStart}>
//                             <div className="bg-gray-300 rounded-md h-1 w-8"></div>
//                         </div>
//                         <button className="absolute right-5 top-2 border-none" type="button"
//                                 title="Close the sheet" onClick={() => setOpen(false)}>
//                             &times;
//                         </button>
//                     </header>
//
//                     <main className="h-screen overflow-y-auto space-y-4">
//                         <h2 className={"text-3xl mb-4"}>Hello, World!</h2>
//                         <p>
//                             Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit explicabo vero quas
//                             eligendi, eos
//                             cupiditate sint aliquam a omnis commodi quos in libero veniam. Quidem, non a quibusdam
//                             consequuntur
//                             mollitia officia numquam sit quos dolorum quaerat reprehenderit laboriosam perspiciatis
//                             consequatur
//                             odit error dolore recusandae iste id quam magnam ut! Sint nulla minus excepturi libero
//                             officiis,
//                             deleniti, delectus obcaecati saepe natus rerum nesciunt!
//                         </p>
//                     </main>
//                 </div>
//
//             </div>
//         </div>
//     );
// }
//


import {useState, useEffect, useRef} from 'react';
import styles from "../styles/Home.module.css"

function Index() {
    const openSheetButton = useRef(null);
    const sheet = useRef(null);
    const sheetContents = useRef(null);
    const draggableArea = useRef(null);
    const closeButton = useRef(null);
    const overlay = useRef(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [notSelectable, setNotSelectable] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    let sheetHeight;
    let dragPosition;

    const setSheetHeight = (value) => {
        sheetHeight = Math.max(0, Math.min(100, value))
        sheetContents.current.style.height = `${sheetHeight}vh`

        if (sheetHeight === 100) {
            // sheetContents.current.classList.add("fullscreen")
            setIsFullScreen(true)
        } else {
            // sheetContents.current.classList.remove("fullscreen")
            setIsFullScreen(false)
        }
    }

    const setIsSheetShown = (value) => {
        sheet.current.setAttribute("aria-hidden", String(!value))
        setIsSheetOpen(value)
    }


    const onDragStart = (event) => {
        dragPosition = touchPosition(event).pageY
        // sheetContents.current.classList.add("not-selectable")
        setNotSelectable(true)
        draggableArea.current.style.cursor = document.body.style.cursor = "grabbing"
    }

    const onDragMove = (event) => {
        if (dragPosition === undefined) return

        const y = touchPosition(event).pageY
        const deltaY = dragPosition - y
        const deltaHeight = deltaY / window.innerHeight * 100

        setSheetHeight(sheetHeight + deltaHeight)
        dragPosition = y
    }

    const onDragEnd = () => {
        dragPosition = undefined
        // sheetContents.current.classList.remove("not-selectable")
        setNotSelectable(false)
        draggableArea.current.style.cursor = document.body.style.cursor = ""

        if (sheetHeight < 25) {
            setIsSheetShown(false)
        } else if (sheetHeight > 75) {
            setSheetHeight(100)
        } else {
            setSheetHeight(50)
        }
    }

    const touchPosition = (event) => {
        return event.touches ? event.touches[0] : event
    }

    useEffect(() => {
        // Open the sheet when clicking the 'open sheet' button
        openSheetButton.current.addEventListener("click", () => {
            setSheetHeight(Math.min(50, 720 / window.innerHeight * 100))
            setIsSheetOpen(true)
        })

// Hide the sheet when clicking the 'close' button
        closeButton.current.addEventListener("click", () => {
            // setIsSheetShown(false)
            setIsSheetOpen(false)
        })

// Hide the sheet when clicking the background
        overlay.current.addEventListener("click", () => {
            // setIsSheetShown(false)
            setIsSheetOpen(false)
        })
        draggableArea.current.addEventListener("mousedown", onDragStart)
        draggableArea.current.addEventListener("touchstart", onDragStart)

        window.addEventListener("mousemove", onDragMove)
        window.addEventListener("touchmove", onDragMove)

        window.addEventListener("mouseup", onDragEnd)
        window.addEventListener("touchend", onDragEnd)
    }, [])
    console.log(styles)
    return (
        <div
            className={`h-screen w-screen bg-black text-white p-10 overflow-hidden`}>
            <button type="button" id="open-sheet" aria-controls="sheet"
                    className={"bg-gray-100 text-black px-5 py-3 rounded-md font-bold"}
                    ref={openSheetButton}
            >
                Open Sheet
            </button>

            {/*Sheet*/}
            <div
                ref={sheet}
                className={`${isSheetOpen ? styles.animationFadeIn : styles.animationFadeOut} transform transition transition-all fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col justify-end items-center`}>
                {/*Overlay*/}
                <div className="absolute top-0 left-0 right-0 bottom-0 -z-10 bg-gray-100 opacity-50"
                     ref={overlay}></div>
                {/*Contents*/}
                <div
                    ref={sheetContents}
                    style={{height: `${sheetHeight}vh`}}
                    className={`${isFullScreen ? "rounded-0" : "rounded-t-xl"} transition ${notSelectable ? "" : "transition-opacity transition-all"} ${isSheetOpen ? (styles.animationSlideIn) : (styles.animationSlideOut)} select-none transform relative max-w-7xl bg-black overflow-y-hidden transition max-h-screen box-border p-4 pt-12 flex flex-col `}
                >
                    <header className="mb-6">
                        <div
                            className={`absolute top-0 left-0 right-0 w-12 m-auto p-4 cursor-grab`}
                            ref={draggableArea}>
                            <div className="bg-gray-300 rounded-md h-1 w-8"></div>
                        </div>
                        <button className="absolute right-5 top-2 border-none" type="button"
                                title="Close the sheet" ref={closeButton}>
                            &times;
                        </button>
                    </header>

                    <main className="h-screen overflow-y-auto space-y-4">
                        <h2 className={"text-3xl mb-4"}>Hello, World!</h2>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Impedit explicabo vero quas
                            eligendi, eos
                            cupiditate sint aliquam a omnis commodi quos in libero veniam. Quidem, non a quibusdam
                            consequuntur
                            mollitia officia numquam sit quos dolorum quaerat reprehenderit laboriosam perspiciatis
                            consequatur
                            odit error dolore recusandae iste id quam magnam ut! Sint nulla minus excepturi libero
                            officiis,
                            deleniti, delectus obcaecati saepe natus rerum nesciunt!
                        </p>
                    </main>
                </div>

            </div>
        </div>
    );
}

export default Index;
