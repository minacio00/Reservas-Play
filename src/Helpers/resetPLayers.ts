export const resetPlayers = (
    funcionamento: any,
    setFuncionamento: Function, updateFuncionamentoData: Function) => {  
        console.log("here")      
        const updatedFuncionamento = funcionamento.map((locationData: any) => {
            const updatedOpeningHours = locationData.openingHours.map((dayData: any) => {
                const updatedQuadras = dayData.quadras.map((quadra: any) => {
                    const updatedTimeSlots = quadra.timeSlots.map((timeSlot: any) => ({
                        ...timeSlot,
                        jogador1: "", // Reset jogador1 to an empty string
                        jogador2: "", // Reset jogador2 to an empty string
                    }));
                    return {
                        ...quadra,
                        timeSlots: updatedTimeSlots,
                    };
                });
                return {
                    ...dayData,
                    quadras: updatedQuadras,
                };
            });

            return {
                ...locationData,
                openingHours: updatedOpeningHours,
            };
        });
        console.log(updatedFuncionamento)
        setFuncionamento(updatedFuncionamento);

        // // Save the updated data to Firestore using the updateFuncionamentoInFirestore function (previously defined)
        updateFuncionamentoData(updatedFuncionamento);
}