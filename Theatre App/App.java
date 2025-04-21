import java.io.FileWriter;  // Imports the FileWriter class to write data to a file.
import java.io.IOException; // Imports the IOException class to handle input/output errors.
import java.util.Scanner;   // Imports the Scanner class for reading input from the user.
import java.util.ArrayList; // Imports ArrayList to store shows and users

public class App {          // Declares a public class called "App".
// Global variables          // A comment indicating the section where global variables are declared.
private static int[][] seats = null; // Declares a static 2D array 'seats' to represent the seating arrangement.
                              // This array will hold integers to track the availability of seats.
private static ArrayList<Show> shows = new ArrayList<>(); // List to store shows
private static ArrayList<User> users = new ArrayList<>(); // List to store users
private static Show currentShow = null; // Currently selected show

public static void main(String[] args) {  // Declares the main method where the execution begins.
    System.out.println("Welcome to the Theatre App!");  // Prints a welcome message to the console.
    initialiseRows(); // Calls the method initialiseRows to set up the seating arrangement.
    runMenu();         // Calls the method runMenu to display the menu and start the interaction loop.
}                      // End of the main method.

public static void initialiseRows() {  // Defines a method called initialiseRows to set up seating rows.
    seats = new int[2][];  // Initializes the 'seats' array with 2 rows (multidimensional).
    seats[0] = new int[12]; // Initializes the first row with 12 seats, all set to 0 (available).
    seats[1] = new int[16]; // Initializes the second row with 16 seats, all set to 0 (available).
}  // End of initialiseRows method.

public static void runMenu() {   // Defines the method runMenu to display the menu and handle user choices.
    int option;                  // Declares an integer variable 'option' to store the user's choice.
    boolean cont = true;         // Declares a boolean variable 'cont' to control the loop that displays the menu.
    while (cont) {               // Starts a while loop that runs as long as 'cont' is true.
        option = getOption();    // Calls the getOption method to display the menu and get user input.
        switch (option) {        // Switch statement to execute the corresponding case based on the 'option' value.
            case 0:              // If the user selects option 0 (Quit).
                cont = false;    // Set 'cont' to false to exit the loop and terminate the program.
                break;           // Exit the switch block.
            case 1:              // If the user selects option 1 (Buy a ticket).
                buyTicket();     // Calls the buyTicket method to handle ticket purchasing.
                break;           // Exit the switch block.
            case 2:              // If the user selects option 2 (Show seating area).
                showSeatingArea(); // Calls the showSeatingArea method to display the seating chart.
                break;           // Exit the switch block.
            case 3:              // If the user selects option 3 (Add Show).
                addShow();       // Calls the addShow method (not implemented yet).
                break;           // Exit the switch block.
            case 4:              // If the user selects option 4 (Add User).
                addUser();       // Calls the addUser method (not implemented yet).
                break;           // Exit the switch block.
            case 5:              // If the user selects option 5 (Save information to file).
                saveToFile();    // Calls the saveToFile method to save data to a file.
                break;           // Exit the switch block.
            case 6:              // If the user selects option 6 (Cancel a ticket).
                cancelTicket();  // Added new case for canceling tickets
                break;           // Exit the switch block.
            default:             // If the user selects an invalid option.
                System.out.println("Option not available. Please select a valid option: "); // Print an error message.
        }  
    }  // End of while loop.
}  // End of runMenu method.

// In the methods where you create Scanner objects, add try-with-resources

private static int getOption() { // Defines the getOption method to display the main menu and get user input.
    int option = -1;              // Declares an integer 'option' to store the user's choice, initially set to -1.
    boolean valid = false;       // Declares a boolean variable 'valid' to check if the input is valid.
    
    try (Scanner input = new Scanner(System.in)) { // Creates a Scanner object that will be automatically closed
        do {                         // Starts a do-while loop to keep asking for input until it's valid.
            System.out.println();    // Prints an empty line to the console for formatting.
            System.out.println("+---------------------------------------------+");  // Prints the menu header.
            System.out.println("| MAIN MENU |");  // Prints the menu title.
            System.out.println("+---------------------------------------------+");  // Prints the menu border.
            System.out.println("| 1) Buy a ticket |");  // Prints option 1 to buy a ticket.
            System.out.println("| 2) Show seating area and available seats |"); // Prints option 2 to show seating area.
            System.out.println("| 3) Add Show |");  // Prints option 3 to add a show (not implemented yet).
            System.out.println("| 4) Add User |");  // Prints option 4 to add a user (not implemented yet).
            System.out.println("| 5) Save information to file |");  // Prints option 5 to save data to a file.
            System.out.println("| 6) Cancel a ticket |");  // Prints option 6 to cancel a ticket.
            System.out.println("| 0) Quit |");  // Prints option 0 to quit the program.
            System.out.println("+---------------------------------------------+");  // Prints the menu border.
            System.out.print("Please select an option: ");  // Prompt the user to select an option.
            try {                          // Starts a try block to catch exceptions in case of invalid input.
                option = input.nextInt();  // Reads the user's input as an integer and stores it in 'option'.
                valid = true;               // Sets 'valid' to true if input is successfully read.
            } catch (Exception e) {        // If an invalid input is entered (non-integer).
                System.out.println("This option not valid."); // Prints an error message.
                input.nextLine(); // Clear the input buffer
            }
        } while (!valid);  
    } // Scanner is automatically closed here
    
    return option;       
}

// Similarly, update other methods that use Scanner
private static void buyTicket() {
    try (Scanner input = new Scanner(System.in)) {
        // Check if there are any shows
        if (shows.isEmpty()) {
            System.out.println("No shows available. Please add a show first.");
            return;
        }
        
        // Select a show if multiple shows exist
        if (shows.size() > 1) {
            System.out.println("Available shows:");
            for (int i = 0; i < shows.size(); i++) {
                System.out.println((i + 1) + ") " + shows.get(i).getName());
            }
            System.out.print("Select a show (1-" + shows.size() + "): ");
            int showIndex = input.nextInt() - 1;
            if (showIndex >= 0 && showIndex < shows.size()) {
                currentShow = shows.get(showIndex);
            } else {
                System.out.println("Invalid show selection.");
                return;
            }
        } else {
            currentShow = shows.get(0);
        }
        
        System.out.println("Buying ticket for: " + currentShow.getName());
        
        // Select user if users exist
        User ticketUser = null;
        if (!users.isEmpty()) {
            System.out.println("Available users:");
            for (int i = 0; i < users.size(); i++) {
                System.out.println((i + 1) + ") " + users.get(i).getName());
            }
            System.out.print("Select a user (1-" + users.size() + ") or 0 for anonymous: ");
            int userIndex = input.nextInt() - 1;
            if (userIndex >= 0 && userIndex < users.size()) {
                ticketUser = users.get(userIndex);
            }
        }
        
        System.out.print("Enter row number: ");   // Prompts the user to enter the row number.
        int row = input.nextInt() - 1;  // Reads the row number and adjusts it by subtracting 1 (to use zero-based indexing).
        System.out.print("Enter seat number: "); // Prompts the user to enter the seat number.
        int seat = input.nextInt() - 1;  // Reads the seat number and adjusts it by subtracting 1 (zero-based indexing).
        
        // Check if row and seat are valid
        if (row < 0 || row >= seats.length || seat < 0 || seat >= seats[row].length) {
            System.out.println("Invalid row or seat number.");
            return;
        }
        
        // Check if the seat is available or not.
        if (seats[row][seat] == 0) {  // If the seat is available (0).
            seats[row][seat] = 1;      // Sets the seat to 1 (occupied).
            System.out.println("Purchase successful."); // Prints a success message.
            
            // Add ticket to user if a user was selected
            if (ticketUser != null) {
                ticketUser.addTicket(currentShow, row, seat);
                System.out.println("Ticket assigned to " + ticketUser.getName());
            }
            
            showSeatingArea();         // Calls the showSeatingArea method to display updated seating area.
        } else {                      // If the seat is already taken.
            System.out.println("This seat is already taken."); // Prints a message that the seat is unavailable.
        }
    }
}  // End of buyTicket method.

private static void showSeatingArea() {  // Defines the showSeatingArea method to display the seating chart.
    int rows = seats.length;       // Stores the number of rows in the 'rows' variable.
    System.out.println(repeatString("=", 76));  // Prints a line of 76 equals signs for formatting.
    System.out.println(" STAGE ");       // Prints the "STAGE" label.
    System.out.println(repeatString("=", 76));  // Prints another line of 76 equals signs for formatting.
    for (int row = 0; row < rows; row++) {  // Loops through each row.
        System.out.print("Row " + (row + 1) + " ");  // Prints the row number (starting from 1).
        int seatsPerRow = seats[row].length;  // Gets the number of seats in the current row.
        if (row == 0) {  // If the current row is the first row.
            System.out.print(" "); // Adds a space for formatting.
        }
        for (int seat = 0; seat < seatsPerRow; seat++) {  // Loops through each seat in the row.
            if (seats[row][seat] == 0) { // If the seat is available.
                System.out.print("[O]");  // Prints [O] for available seats.
            } else {  // If the seat is not available.
                System.out.print("[X]");  // Prints [X] for occupied seats.
            }
        }
        System.out.println();  // Prints a new line after displaying the seats in the row.
    }
    System.out.println(repeatString("=", 76));  // Prints a line of 76 equals signs for formatting.
    System.out.println("LEGEND: [O] = Seat available, [X] = Seat not available"); // Prints the legend for seat status.
    System.out.println(repeatString("=", 76));  // Prints another line of 76 equals signs for formatting.
    System.out.println();  // Prints an empty line for formatting.
}  // End of showSeatingArea method.

private static void addShow() {  // Defines the addShow method
    try (Scanner input = new Scanner(System.in)) {
        System.out.println("+---------------------------------------------+");
        System.out.println("| ADD SHOW |");
        System.out.println("+---------------------------------------------+");
        
        System.out.print("Enter show name: ");
        String name = input.nextLine();
        
        System.out.print("Enter show date (DD/MM/YYYY): ");
        String date = input.nextLine();
        
        System.out.print("Enter show time (HH:MM): ");
        String time = input.nextLine();
        
        System.out.print("Enter ticket price: ");
        double price = 0;
        try {
            price = input.nextDouble();
        } catch (Exception e) {
            System.out.println("Invalid price format. Using default price of 10.0");
            price = 10.0;
            input.nextLine(); // Clear the input buffer
        }
        
        // Create and add the new show
        Show newShow = new Show(name, date, time, price);
        shows.add(newShow);
        
        // Set as current show if it's the first one
        if (shows.size() == 1) {
            currentShow = newShow;
        }
        
        System.out.println("Show added successfully!");
        System.out.println("Total shows: " + shows.size());
    }
}  // End of addShow method.

private static void addUser() {  // Defines the addUser method
    try (Scanner input = new Scanner(System.in)) {
        System.out.println("+---------------------------------------------+");
        System.out.println("| ADD USER |");
        System.out.println("+---------------------------------------------+");
        
        System.out.print("Enter user name: ");
        String name = input.nextLine();
        
        System.out.print("Enter user email: ");
        String email = input.nextLine();
        
        System.out.print("Enter user phone: ");
        String phone = input.nextLine();
        
        // Create and add the new user
        User newUser = new User(name, email, phone);
        users.add(newUser);
        
        System.out.println("User added successfully!");
        System.out.println("Total users: " + users.size());
    }
}  // End of addUser method.

// Move the cancelTicket method inside the App class, before the closing brace
private static void cancelTicket() {
    // Use try-with-resources to automatically close the Scanner
    try (Scanner input = new Scanner(System.in)) {
        // Check if there are any shows available to cancel tickets for
        if (shows.isEmpty()) {
            System.out.println("No shows available.");
            return;
        }
        
        // If multiple shows exist, let the user select which show to cancel tickets for
        if (shows.size() > 1) {
            System.out.println("Available shows:");
            // Display all shows with numbers for selection
            for (int i = 0; i < shows.size(); i++) {
                System.out.println((i + 1) + ") " + shows.get(i).getName());
            }
            // Prompt user to select a show
            System.out.print("Select a show (1-" + shows.size() + "): ");
            int showIndex = input.nextInt() - 1;
            // Validate the show selection
            if (showIndex >= 0 && showIndex < shows.size()) {
                currentShow = shows.get(showIndex);
            } else {
                System.out.println("Invalid show selection.");
                return;
            }
        } else {
            // If only one show exists, select it automatically
            currentShow = shows.get(0);
        }
        
        // Rest of the method remains the same, just properly indented inside the try block
        System.out.println("Canceling ticket for: " + currentShow.getName());
        
        // Provide two options for cancellation: by seat number or by user
        System.out.println("Cancel by:");
        System.out.println("1) Seat number");
        System.out.println("2) User");
        System.out.print("Select option (1-2): ");
        
        // Read and validate the cancellation option
        int cancelOption = 0;
        try {
            cancelOption = input.nextInt();
        } catch (Exception e) {
            System.out.println("Invalid option.");
            input.nextLine(); // Clear input buffer
            return;
        }
        
        // Option 1: Cancel by seat number
        if (cancelOption == 1) {
            // Get row and seat numbers from user
            System.out.print("Enter row number: ");
            int row = input.nextInt() - 1;
            System.out.print("Enter seat number: ");
            int seat = input.nextInt() - 1;
            
            // Validate row and seat numbers
            if (row < 0 || row >= seats.length || seat < 0 || seat >= seats[row].length) {
                System.out.println("Invalid row or seat number.");
                return;
            }
            
            // Check if the seat is actually occupied
            if (seats[row][seat] == 1) {
                // Mark the seat as available
                seats[row][seat] = 0;
                
                // Find and remove the ticket from the user who owns it
                for (User user : users) {
                    if (user.removeTicket(currentShow, row, seat)) {
                        System.out.println("Ticket removed from user: " + user.getName());
                        break;
                    }
                }
                
                // Confirm cancellation and show updated seating
                System.out.println("Ticket canceled successfully.");
                showSeatingArea();
            } else {
                // Inform user if the seat is not occupied
                System.out.println("This seat is not occupied.");
            }
        } 
        // Option 2: Cancel by user
        else if (cancelOption == 2) {
            // Check if there are any registered users
            if (users.isEmpty()) {
                System.out.println("No registered users.");
                return;
            }
            
            // Display all users with their ticket counts
            System.out.println("Select user:");
            for (int i = 0; i < users.size(); i++) {
                User user = users.get(i);
                System.out.println((i + 1) + ") " + user.getName() + " (Tickets: " + user.getTicketCount() + ")");
            }
            
            // Get user selection
            System.out.print("Enter user number: ");
            int userIndex = input.nextInt() - 1;
            
            // Validate user selection
            if (userIndex < 0 || userIndex >= users.size()) {
                System.out.println("Invalid user selection.");
                return;
            }
            
            // Get the selected user
            User selectedUser = users.get(userIndex);
            
            // Check if the selected user has any tickets
            if (selectedUser.getTicketCount() == 0) {
                System.out.println("This user has no tickets to cancel.");
                return;
            }
            
            // Display all tickets owned by the selected user
            System.out.println("Tickets for " + selectedUser.getName() + ":");
            System.out.println(selectedUser.getTicketsInfo());
            
            // Get ticket selection from user
            System.out.print("Enter ticket number to cancel (1-" + selectedUser.getTicketCount() + "): ");
            int ticketIndex = input.nextInt() - 1;
            
            // Validate ticket selection
            if (ticketIndex < 0 || ticketIndex >= selectedUser.getTicketCount()) {
                System.out.println("Invalid ticket selection.");
                return;
            }
            
            // Get the ticket to cancel and its details
            Ticket ticketToCancel = selectedUser.getTicket(ticketIndex);
            if (ticketToCancel != null) {
                int ticketRow = ticketToCancel.getRow();
                int ticketSeat = ticketToCancel.getSeat();
                
                // Mark the seat as available in the seating chart
                seats[ticketRow][ticketSeat] = 0;
                
                // Remove the ticket from the user's collection
                selectedUser.removeTicketByIndex(ticketIndex);
                
                // Confirm cancellation and show updated seating
                System.out.println("Ticket canceled successfully.");
                showSeatingArea();
            }
        } else {
            // Handle invalid option selection
            System.out.println("Invalid option.");
        }
    }
}

private static void saveToFile() {  // Defines the saveToFile method to write data to a file.
    try {  // Starts a try block to handle potential file I/O exceptions.
        FileWriter file = new FileWriter("TheatreData.txt");  // Creates a FileWriter object to write to "TheatreData.txt".
        file.write("Theatre App Data\n");  // Writes header to the file.
        file.write(repeatString("=", 50) + "\n");  // Writes a separator line.
        
        // Save shows information
        file.write("\nSHOWS (" + shows.size() + "):\n");
        for (int i = 0; i < shows.size(); i++) {
            Show show = shows.get(i);
            file.write((i+1) + ". " + show.getName() + " - " + show.getDate() + " " + show.getTime() + 
                      " - Price: $" + show.getPrice() + "\n");
        }
        
        // Save users information
        file.write("\nUSERS (" + users.size() + "):\n");
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            file.write((i+1) + ". " + user.getName() + " - " + user.getEmail() + " - " + user.getPhone() + "\n");
            
            // Save user's tickets if any
            if (user.getTicketCount() > 0) {
                file.write("   Tickets: " + user.getTicketCount() + "\n");
                file.write(user.getTicketsInfo() + "\n");
            }
        }
        
        // Save seating information
        file.write("\nSEATING INFORMATION:\n");
        int availableSeats = 0;
        int totalSeats = 0;
        
        for (int row = 0; row < seats.length; row++) {
            for (int seat = 0; seat < seats[row].length; seat++) {
                totalSeats++;
                if (seats[row][seat] == 0) {
                    availableSeats++;
                }
            }
        }
        
        file.write("Total seats: " + totalSeats + "\n");
        file.write("Available seats: " + availableSeats + "\n");
        file.write("Occupied seats: " + (totalSeats - availableSeats) + "\n");
        
        file.close();  // Closes the file after writing.
        System.out.println("Data saved to file successfully.");  // Prints a success message.
    } catch (IOException exception) {  // Catches IOException if any error occurs during file writing.
        System.out.println("Error while writing in a file.");  // Prints an error message.
    }
}  // End of saveToFile method.

// Show class to store show information
static class Show {
    private String name;    // Name of the show
    private String date;    // Date of the show
    private String time;    // Time of the show
    private double price;   // Price of tickets for the show
    
    // Constructor to initialize all properties
    public Show(String name, String date, String time, double price) {
        this.name = name;
        this.date = date;
        this.time = time;
        this.price = price;
    }
    
    // Getter methods - retrieve property values
    public String getName() {
        return name;
    }
    
    public String getDate() {
        return date;
    }
    
    public String getTime() {
        return time;
    }
    
    public double getPrice() {
        return price;
    }
    
    // Setter methods - modify property values with validation
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
    }
    
    public void setDate(String date) {
        if (date != null && !date.trim().isEmpty()) {
            this.date = date;
        }
    }
    
    public void setTime(String time) {
        if (time != null && !time.trim().isEmpty()) {
            this.time = time;
        }
    }
    
    public void setPrice(double price) {
        if (price >= 0) {
            this.price = price;
        }
    }
}

// User class to store user information
static class User {
    private String name;
    private String email;
    private String phone;
    private ArrayList<Ticket> tickets;
    
    public User(String name, String email, String phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.tickets = new ArrayList<>();
    }
    
    // Existing getters
    public String getName() {
        return name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getPhone() {
        return phone;
    }
    
    // New setter methods
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
    }
    
    public void setEmail(String email) {
        if (email != null && !email.trim().isEmpty()) {
            this.email = email;
        }
    }
    
    public void setPhone(String phone) {
        if (phone != null && !phone.trim().isEmpty()) {
            this.phone = phone;
        }
    }
    
    // Existing methods
    public void addTicket(Show show, int row, int seat) {
        tickets.add(new Ticket(show, row, seat));
    }
    
    public int getTicketCount() {
        return tickets.size();
    }
    
    // New method to get a specific ticket
    public Ticket getTicket(int index) {
        if (index >= 0 && index < tickets.size()) {
            return tickets.get(index);
        }
        return null;
    }
    
    // New method to remove a ticket by show, row and seat
    public boolean removeTicket(Show show, int row, int seat) {
        for (int i = 0; i < tickets.size(); i++) {
            Ticket ticket = tickets.get(i);
            if (ticket.getShow() == show && ticket.getRow() == row && ticket.getSeat() == seat) {
                tickets.remove(i);
                return true;
            }
        }
        return false;
    }
    
    // New method to remove a ticket by index
    public void removeTicketByIndex(int index) {
        if (index >= 0 && index < tickets.size()) {
            tickets.remove(index);
        }
    }
    
    public String getTicketsInfo() {
        StringBuilder info = new StringBuilder();
        for (int i = 0; i < tickets.size(); i++) {
            Ticket ticket = tickets.get(i);
            info.append("     " + (i+1) + ") ").append(ticket.getShow().getName())
                .append(", Row ").append(ticket.getRow() + 1)
                .append(", Seat ").append(ticket.getSeat() + 1)
                .append("\n");
        }
        return info.toString();
    }
}

// Ticket class to store ticket information
static class Ticket {
    private Show show;
    private int row;
    private int seat;
    
    public Ticket(Show show, int row, int seat) {
        this.show = show;
        this.row = row;
        this.seat = seat;
    }
    
    public Show getShow() {
        return show;
    }
    
    public int getRow() {
        return row;
    }
    
    public int getSeat() {
        return seat;
    }
    
    // New setter methods
    public void setShow(Show show) {
        if (show != null) {
            this.show = show;
        }
    }
    
    public void setRow(int row) {
        if (row >= 0) {
            this.row = row;
        }
    }
    
    public void setSeat(int seat) {
        if (seat >= 0) {
            this.seat = seat;
        }
    }
}

// Helper method to replace String.repeat() for Java versions before 11
private static String repeatString(String str, int times) {
    StringBuilder result = new StringBuilder();
    for (int i = 0; i < times; i++) {
        result.append(str);
    }
    return result.toString();
}
}  // End of the App class.
