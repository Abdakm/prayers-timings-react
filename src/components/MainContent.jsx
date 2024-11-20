import { Grid, Divider, Stack, InputLabel, MenuItem, FormControl, Select} from './MuiBox'
import { Prayer, Toggle } from "./Box";
import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";
import "moment/dist/locale/ar-dz";
import {Commet} from 'react-loading-indicators'
moment.locale("ar");
export default function MainContent() {
	// STATES
	const [loading, setLoading] = useState(true);
	const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
	// Fajr: "04:20",
	const [timings, setTimings] = useState({
		Fajr: "04:20",
		Dhuhr: "11:50",
		Asr: "15:18",
		Sunset: "18:03",
		Isha: "19:33",
	});
	const [remainingTime, setRemainingTime] = useState("");
	const [selectedCity, setSelectedCity] = useState({
		displayName: "مكة المكرمة",
		apiName: "Makkah al Mukarramah",
	});
	const [today, setToday] = useState("");
		// {
		// 	displayName: "مكة المكرمة",
		// 	apiName: "Makkah al Mukarramah",
		// },
	const avilableCities = [
		{
			displayName: "مكة المكرمة",
			apiName: "Makkah al Mukarramah",
		},
		{
			displayName: "الرياض",
			apiName: "Riyadh",
		},
		{
			displayName: "الدمام",
			apiName: "Dammam",
		},
	];
	// { key: "Fajr",   displayName: "الفجر" },
	const prayersArray = [
		{ key: "Fajr",   displayName: "الفجر" },
		{ key: "Dhuhr",  displayName: "الظهر" },
		{ key: "Asr",    displayName: "العصر" },
		{ key: "Sunset", displayName: "المغرب" },
		{ key: "Isha",   displayName: "العشاء" },
	];
	const getTimings = async () => {
		try{
			const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`);
			setTimings(response.data.data.timings);	
			setLoading(false)
		} catch(error){
			throw new Error('there is an error in the data !!!')
		}
	};
	useEffect(() => {
		getTimings();
	}, [selectedCity]);


	useEffect(() => {
		let interval = setInterval(() => {
			setupCountdownTimer();
		}, 1000);

		const t = moment();
		setToday(t.format("dddd, MMM Do / YYYY | h:mm A"));

		return () => {
			clearInterval(interval);
		};
	}, [timings]);

	const setupCountdownTimer = () => {
		  const momentNow = moment();
		  let nextPrayerIndex = 0;

		  // Find the next prayer by comparing current time
		  for (let i = 0; i < prayersArray.length; i++) {
		    const prayerTime = moment(timings[prayersArray[i].key], "HH:mm"); // 24 system hour not 12 system hour
		    if (momentNow.isBefore(prayerTime)) {
		      nextPrayerIndex = i;
		      break;
		    }
		  }

		  const nextPrayer = prayersArray[nextPrayerIndex];
		  const nextPrayerTime = moment(timings[nextPrayer.key], "HH:mm");
		  const remainingTimeMs = nextPrayerTime.diff(momentNow);

		  const duration = moment.duration(remainingTimeMs);
		  let hours = duration.hours() > 9 ? duration.hours() : '0'+duration.hours();
		  let minutes = duration.minutes() > 9 ? duration.minutes() : '0'+duration.minutes();
		  let seconds = duration.seconds() > 9 ? duration.seconds() : '0'+duration.seconds();

		  if(duration.hours() <= 0){
		  	setRemainingTime(`${hours}: ${seconds}`)
		  } else if(duration.hours() <= 0 && duration.minutes() <= 0){
		  	setRemainingTime(`${seconds}`)
		  } else {
		  	setRemainingTime(`${hours}:${minutes}:${seconds}`);		  	
		  }
		  setNextPrayerIndex(nextPrayerIndex);
	};

	const handleCityChange = (event) => {
		const cityObject = avilableCities.find(city => city.apiName == event.target.value );
		setSelectedCity(cityObject);
	};

	if(loading){
		return (
			<div style={{height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<h1>
					<Commet color="#32cd32" size="medium" text="" textColor="" />
				</h1>
			</div>
		)
	}

	return (
		<>
			{/* TOP ROW */}
			<Grid container>
				<Grid xs={5} style={{placeItems: 'center'}}>
					<div>
						<h2>{today}</h2>
						<h1>{selectedCity.displayName}</h1>
					</div>
				</Grid>

				<Grid xs={5} style={{placeItems: 'center'}}>
					<div>
						<h2>
							متبقي حتى صلاة{" "}
							{prayersArray[nextPrayerIndex].displayName}
						</h2>
						<h1>{remainingTime}</h1>
					</div>
				</Grid>

				<Grid xs={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<div style={{width: '100%', height: '100%'}}>
						<Toggle />
					</div>
				</Grid>
			</Grid>
			{/*== TOP ROW ==*/}

			<Divider style={{ borderColor: "white", opacity: "0.1" }} />

			{/* PRAYERS CARDS */}
			<Stack direction="row" justifyContent={"space-around"} style={{ marginTop: "50px", flexWrap: 'wrap' }} >
				{
					Object.entries(timings).map(([key, value]) => {
						const prayer = prayersArray.find((name) => name.key === key);
						if(!prayer) return null;
						return(
							<Prayer 
								key={key}
								name = {prayer.displayName}
								time={value}
							/>
						)
					})
				} 
			</Stack>

			{/* SELECT CITY */}
			<Stack direction="row" justifyContent={"center"} style={{ marginTop: "40px" }} >
				<FormControl sx={{ width: "20%", color: "white" }}>
					<InputLabel id="demo-simple-select-label"> <span style={{ color: "white" }}>المدينة</span> </InputLabel>
					<Select
						style={{ color: "white" }}
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={selectedCity.apiName}
						label="Age"
						onChange={handleCityChange}
					>
						{avilableCities.map((city) => {
							return (
								<MenuItem
									value={city.apiName}
									key={city.apiName}
								>
									{city.displayName}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</Stack>
		</>
	);
}
