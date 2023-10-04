const timeSlots = [
    { slot: "07:00", jogador1: "", jogador2: "" },
    { slot: "8:30", jogador1: "", jogador2: "" },
    { slot: "10:00", jogador1: "", jogador2: "" },
    { slot: "11:30", jogador1: "", jogador2: "" },
    { slot: "13:00", jogador1: "", jogador2: "" },
    { slot: "14:30", jogador1: "", jogador2: "" },
    { slot: "16:00", jogador1: "", jogador2: "" },
    { slot: "17:30", jogador1: "", jogador2: "" },
    { slot: "19:00", jogador1: "", jogador2: "" },
    { slot: "20:30", jogador1: "", jogador2: "" }
  ];
  
  interface Dia {
    dia: string;
    aberto: boolean;
    quadras: {
      nomeQuadra: string;
      timeSlots: typeof timeSlots;
    }[];
  }
  
  const diasDaSemana: Dia[] = [
    {
      dia: "segunda",
      aberto: true,
      quadras: []
    },
    {
      dia: "terca",
      aberto: true,
      quadras: []
    },
    {
      dia: "quarta",
      aberto: true,
      quadras: []
    },
    {
      dia: "quinta",
      aberto: true,
      quadras: []
    },
    {
      dia: "sexta",
      aberto: true,
      quadras: []
    },
    {
      dia: "sabado",
      aberto: true,
      quadras: []
    },
    {
      dia: "domingo",
      aberto: true,
      quadras: []
    }
  ];
  
  // Create three courts for "joquei"
  for (const dia of diasDaSemana) {
    dia.quadras.push(
      {
        nomeQuadra: "Quadra-1",
        timeSlots: timeSlots
      },
      {
        nomeQuadra: "Quadra-2",
        timeSlots: timeSlots
      },
      {
        nomeQuadra: "Quadra-3",
        timeSlots: timeSlots
      }
    );
  }
  
  // Create one court for "play"
  const playQuadra = {
    nomeQuadra: "Quadra-1",
    timeSlots: timeSlots
  };
  
  export const funcionamento = [
    {
      name: "joquei",
      openingHours: diasDaSemana
    },
    {
      name: "play",
      openingHours: diasDaSemana.map(dia => ({
        ...dia,
        quadras: [playQuadra]
      }))
    }
  ];