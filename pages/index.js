import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";

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
		sheetHeight = Math.max(0, Math.min(100, value));
		sheetContents.current.style.height = `${sheetHeight}vh`;

		if (sheetHeight === 100) {
			// sheetContents.current.classList.add("fullscreen")
			setIsFullScreen(true);
		} else {
			// sheetContents.current.classList.remove("fullscreen")
			setIsFullScreen(false);
		}
	};

	const setIsSheetShown = (value) => {
		sheet.current.setAttribute("aria-hidden", String(!value));
		setIsSheetOpen(value);
	};

	const onDragStart = (event) => {
		dragPosition = touchPosition(event).pageY;
		// sheetContents.current.classList.add("not-selectable")
		setNotSelectable(true);
		draggableArea.current.style.cursor = document.body.style.cursor =
			"grabbing";
	};

	const onDragMove = (event) => {
		if (dragPosition === undefined) return;
		console.log(
			"drag position",
			dragPosition,
			"touch position",
			touchPosition(event).pageY
		);
		const y = touchPosition(event).pageY;
		const deltaY = dragPosition - y;
		const deltaHeight = (deltaY / window.innerHeight) * 100;
		console.log("delta height", deltaHeight, "sheet height", sheetHeight);
		setSheetHeight(sheetHeight + deltaHeight);
		dragPosition = y;
	};

	const onDragEnd = () => {
		dragPosition = undefined;
		// sheetContents.current.classList.remove("not-selectable")
		setNotSelectable(false);
		draggableArea.current.style.cursor = document.body.style.cursor = "";

		if (sheetHeight < 25) {
			setIsSheetShown(false);
		} else if (sheetHeight > 60 && sheetHeight < 75) {
			setSheetHeight(75);
		} else if (sheetHeight > 75) {
			setSheetHeight(100);
		} else {
			setSheetHeight(50);
		}
	};

	const touchPosition = (event) => {
		return event.touches ? event.touches[0] : event;
	};

	useEffect(() => {
		// Open the sheet when clicking the 'open sheet' button
		openSheetButton.current.addEventListener("click", () => {
			setSheetHeight(Math.min(0, (720 / window.innerHeight) * 100));
			setIsSheetOpen(true);
		});

		// Hide the sheet when clicking the 'close' button
		closeButton.current.addEventListener("click", () => {
			// setIsSheetShown(false)
			setIsSheetOpen(false);
		});

		// Hide the sheet when clicking the background
		overlay.current.addEventListener("click", () => {
			// setIsSheetShown(false)
			setIsSheetOpen(false);
		});
		draggableArea.current.addEventListener("mousedown", onDragStart);
		draggableArea.current.addEventListener("touchstart", onDragStart);

		window.addEventListener("mousemove", onDragMove);
		window.addEventListener("touchmove", onDragMove);

		window.addEventListener("mouseup", onDragEnd);
		window.addEventListener("touchend", onDragEnd);
	}, []);
	return (
		<div className={`h-screen w-screen bg-black text-white overflow-hidden`}>
			<div className='h-full overflow-auto --'>
				<div className='overflow-auto p-10' style={{ height: "200vh" }}>
					<button
						type='button'
						id='open-sheet'
						aria-controls='sheet'
						className={"bg-gray-100 text-black px-5 py-3 rounded-md font-bold"}
						ref={openSheetButton}
					>
						Open Sheet
					</button>
				</div>
			</div>

			{/*Sheet*/}
			<div
				ref={sheet}
				className={`${
					isSheetOpen
						? styles.animationFadeIn
						: `${styles.animationFadeOut} transform transition-all duration-500 translate-y-full`
				} transform fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col justify-end items-center`}
			>
				{/*Overlay*/}
				<div
					className={`absolute top-0 left-0 right-0 bottom-0 -z-10 bg-gray-100 opacity-50 transform transition-all ${
						isSheetOpen ? "opacity-50" : "opacity-0"
					}`}
					ref={overlay}
				></div>
				{/*Contents*/}
				<div
					className={`${
						isFullScreen ? "rounded-0" : "rounded-t-xl"
					} transition ${notSelectable ? "" : "transition-all"} ${
						isSheetOpen ? styles.animationSlideIn : styles.animationSlideOut
					} select-none transform relative max-w-7xl bg-black overflow-x-hidden overflow-y-hidden transition max-h-screen box-border flex flex-col `}
				>
					<header className='mb-6'>
						<div
							className={`absolute top-0 left-0 right-0 w-12 m-auto p-4 cursor-grab`}
							ref={draggableArea}
						>
							<div className='bg-gray-300 rounded-md h-1 w-8'></div>
						</div>
						<button
							className='absolute right-5 top-2 border-none'
							type='button'
							title='Close the sheet'
							ref={closeButton}
						>
							&times;
						</button>
					</header>

					<main
						className='w-screen max-w-7xl overflow-y-auto flex flex-col items-start p-3'
						ref={sheetContents} 
						style={{ height: `${sheetHeight}vh` }}
					>
						<div className='h-20'></div>
					</main>
				</div>
			</div>
		</div>
	);
}

export default Index;
