import { useState, useEffect, useCallback } from "react";
import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from "./components/AppointmentInfo";

// Container for the main components and the main logic.
export default function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("petName");
  const [orderBy, setOrderBy] = useState("asc");

  // Temporary array to show the results from a searchbar query.
  const filterAppointments = appointmentList
    .filter((item) => {
      // The search bar will look either for the pet name, the owner name nor the notes.
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      let order = orderBy === "asc" ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order;
    });

  // This hook fetch data from a certain location, for this portafolio purpose, the data is
  // fetched from the public folder, instead of a actual API.
  // This is represented to simulate GET meth.
  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        setAppointmentList(data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top" />
        Your appointments
      </h1>
      <AddAppointment
        onSendAppointment={(myAppointment) =>
          setAppointmentList([...appointmentList, myAppointment])
        }
        lastId={appointmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0
        )}
      />
      <Search
        query={query}
        orderBy={orderBy}
        sortBy={sortBy}
        onQueryChange={(myQuery) => setQuery(myQuery)}
        onOrderByChange={(myOrder) => setOrderBy(myOrder)}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />
      {/*
        The classic 'update' feature was not included due to the better user experience
        gainance by simple deleting an appointment and creating a new one.
      */}
      <ul className="divide-y divide-gray-200">
        {filterAppointments.map((appointment) => {
          return (
            <AppointmentInfo
              key={appointment.id}
              appointment={appointment}
              onDeleteAppointment={(appointmentId) =>
                setAppointmentList(
                  appointmentList.filter(
                    (appointment) => appointment.id !== appointmentId
                  )
                )
              }
            />
          );
        })}
      </ul>
    </div>
  );
}
