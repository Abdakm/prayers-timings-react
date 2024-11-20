import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function MediaCard({ name, time }) {
	return (
		<Card sx={{ width: 260, margin: 2 }}>
			<CardMedia sx={{ height: 140 }} image='logo.jpg' component="img"/>
			<CardContent>
				<h2>{name}</h2>
				<Typography variant="h4" color="text.secondary"> {time} </Typography>
			</CardContent>
		</Card>
	);
}
