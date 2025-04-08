export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    available: boolean;
    rating: number;
    picture: string;
  }
  
  export const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. John Doe",
      specialization: "Cardiologist",
      available: true,
      rating: 4.5,
      picture: "",
    },
    {
      id: 2,
      name: "Dr. Jane Smith",
      specialization: "Neurologist",
      available: false,
      rating: 4.8,
      picture: "",
    },
    {
      id: 3,
      name: "Dr. Emma Brown",
      specialization: "Dermatologist",
      available: true,
      rating: 4.2,
      picture: "",
    },
    {
      id: 4,
      name: "Dr. Mike Johnson",
      specialization: "Orthopedic",
      available: true,
      rating: 4.7,
      picture: "",
    },
    {
      id: 5,
      name: "Dr. Sarah White",
      specialization: "Pediatrician",
      available: false,
      rating: 2.3,
      picture: "",
    },
  ];
  