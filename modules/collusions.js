function genericColl(player, cObs, tolerance = 0){
        
        const dx = player.col_x - cObs.col_x; 
        const dy = player.col_y - cObs.col_y;  

        const distance = ((((dx) ** (2)) + ((dy) ** (2))) ** (0.5)); 
        let sumOf_rad = player.col_rad + cObs.col_rad - tolerance; 

    return [(distance < sumOf_rad) , dx , dy , distance , sumOf_rad];   
};



export { genericColl  };

    

