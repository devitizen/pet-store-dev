// "StAuth10244: I Jonghwan Lee, 000811948 certify that this material is my original work. Noother person's work has been used without due acknowledgement. I have notmade my work available to anyone else."

// Starter code for the front-end, includes examples of accessing all server 
// API routes with AJAX requests.

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Material UI is included in the install of the front end, so we have access
// to components like Buttons, etc, when we import them.

function Pets() {
  
  // isLoaded keeps track of whether the initial load of pet data from the
  // server has occurred.  pets is the array of pets data in the table, and 
  // searchResults is the array of pets data after a search request.
  const [isLoaded, setIsLoaded] = useState(false);
  const [pets, setPets] = useState([]);
  const [id, setId] = useState(0);
  const [animal, setAnimal] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState(0);
  const [price, setPrice] = useState(0);
  const [open, setOpen] = useState(false);
  
  const baseUrl = "https://pet-store-dev.heroku.com";
  const getAllUrl = baseUrl + "/api?act=getall";
  const colorTheme = createTheme({
      palette: {
          neutral: {main: '#64748B', contrastText: '#fff'}
      }
  });
 
  // fetches all pet data from the server
  function fetchPets() {
      console.log(getAllUrl);
      fetch(getAllUrl, {mode: 'cors'})
          .then(res => res.json())
          .then(
              (result) => {
                  setIsLoaded(true);
                  setPets(result);
              });
  }
  
  // use fetchPets as an effect with an empty array as a 2nd argument, which 
  // means fetchPets will ONLY be called when the component first mounts
  useEffect(fetchPets, []);

  
  // Adds a pet to the pet inventory
  function addPet() {
      let url = baseUrl + "/api?act=add&animal=" + animal + "&description=" + description +
          "&age=" + age + "&price=" + price;
      fetch(url)
          .then(res => res.json())
          .then(
              (result) => {
                  fetchPets();
                  closeDialog();
              });
  }

  // Deletes a pet from the pet inventory
  function deletePet(id) {
      let url = baseUrl + "/api?act=delete&id=" + id;
      fetch(url)
          .then(res => res.json())
          .then(
              (result) => {
                  fetchPets();
              });
  }

  // Updates a pet in the pet inventory
    function updatePet() {
        let url = baseUrl + "/api?act=update&id=" + id + "&animal=" + animal +
            "&description=" + description + "&age=" + age + "&price=" + price;
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    fetchPets();
                    closeDialog();
                });
    }
  
  // Searches for pets in the pet inventory
  function searchPet(searchTerm) {
      let url = baseUrl + "/api?act=search&term=" + searchTerm;
      fetch(url)
          .then(res => res.json())
          .then(
              (result) => {
                  setPets(result);
              });
  }

  // Opens dialog to add a pet
  function openNewDialog() {
      setOpen(true);
  };

  // Closes dialog 
  function closeDialog() {
      setId(0);
      setAnimal("");
      setDescription("");
      setAge(0);
      setPrice(0);
      setOpen(false);
  };

  // Opens dialog to edit a pet
  function openEditDialog(id) {
      fetch(getAllUrl)
          .then(res => res.json())
          .then(
              (result) => {
                  let pet = (result.filter(pet => pet.id === id))[0];
                  setId(pet.id);
                  setAnimal(pet.animal);
                  setDescription(pet.description);
                  setAge(pet.age);
                  setPrice(pet.price);
                  setOpen(true);
              });
  }


  // If data has loaded, render the table of pets, buttons that execute the 
  // above functions when they are clicked, and a table for search results. 
  // Notice how we can use Material UI components like Button if we import 
  // them as above.

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container sx={{maxWidth: 1024, minWidth: 650}}>
        <Box sx={{typography: "h4", textAlign: "center", my: 5}}>Pet Management System</Box>
        <Box sx={{typography: "h5"}}>Pets</Box>

        <Box sx={{mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={openNewDialog}>Add new pet</Button>
            <TextField label="Search Pet" size="small" sx={{width: 300}} onChange={(e)=>searchPet(e.target.value)}></TextField>
        </Box>

        <TableContainer sx={{my: 2}}>
            <Table aria-label="simple table" >
                <TableHead>
                <TableRow>
                    <TableCell sx={{width: "20%", border: 1, fontSize: 16}}>Animal</TableCell>
                    <TableCell sx={{border: 1, fontSize: 16}}>Description</TableCell>
                    <TableCell sx={{width: "14%", border: 1, fontSize: 16}}>Age</TableCell>
                    <TableCell sx={{width: "14%", border: 1, fontSize: 16}}>Price</TableCell>
                    <TableCell sx={{width: "20%", border: 1, fontSize: 16}}>Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {pets.map((pet) => (
                    <TableRow key={pet.id}>
                        <TableCell sx={{border: 1, fontSize: 16}}>{pet.animal}</TableCell>
                        <TableCell sx={{border: 1, fontSize: 16}}>{pet.description}</TableCell>
                        <TableCell sx={{border: 1, fontSize: 16}} align="right">{pet.age} year(s)</TableCell>
                        <TableCell sx={{border: 1, fontSize: 16}} align="right">$ {pet.price}</TableCell>
                        <TableCell sx={{border: 1}} >
                            <Box sx={{display: "flex", justifyContent: "center"}}>
                                <Button variant="outlined" size="small" onClick={()=>openEditDialog(pet.id)} sx={{mr: "10px"}}>Edit</Button>
                                <Button variant="outlined" size="small" onClick={()=>deletePet(pet.id)} color="error">Delete</Button>
                            </Box>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        <Dialog open={open} onClose={closeDialog}>
            <Box component="form" onSubmit={id === 0 ? addPet : () => updatePet(id)} sx={{p: "10px"}} >
                <DialogTitle>{id === 0 ? "Add new pet" : "Edit pet"}</DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        <TextField 
                            label="Animal" margin="normal" required autoFocus
                            defaultValue={animal} 
                            onChange={(e)=>setAnimal(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label="Description" margin="normal" fullWidth multiline rows={3}
                            defaultValue={description} 
                            onChange={(e)=>setDescription(e.target.value)} />
                    </Grid>
                    <Grid container sx={{display: "flex", justifyContent: "space-between"}}>
                        <Grid item xs={12} sm={5}>
                            <TextField 
                                label="Age" margin="normal" type="number"
                                InputProps={{ inputProps: { min: 0}, endAdornment: <InputAdornment position="start">year(s)</InputAdornment>}}
                                defaultValue={age} 
                                onChange={(e)=>setAge(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField 
                                label="Price" margin="normal" type="number"
                                InputProps={{ inputProps: { min: 0, step: 0.01}, startAdornment: <InputAdornment position="start">$</InputAdornment>}}
                                defaultValue={price}
                                onChange={(e)=>setPrice(e.target.value)}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <ThemeProvider theme={colorTheme}>
                        <Button variant="contained" color="neutral" onClick={closeDialog}>Cancel</Button>
                        <Button variant="contained" type="submit">Submit</Button>
                    </ThemeProvider>
                </DialogActions>
            </Box>
        </Dialog>
      </Container>
    );
  }
}

function App() {
  return (
    <div>
      <Pets />
    </div>
  );
}

export default App;
