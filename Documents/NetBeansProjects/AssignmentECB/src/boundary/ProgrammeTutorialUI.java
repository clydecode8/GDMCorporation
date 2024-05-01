/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package boundary;

import java.util.Scanner;

/**
 *
 * @author User
 */
public class ProgrammeTutorialUI {
    
    public int getMenuChoice() {
        
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Tutorial Group Management System");
        System.out.println("\n---------------------------");
        System.out.println("1. Add Tutorial Group to Programme ");
        System.out.println("2. Remove Tutorial Group from Programme");
        System.out.println("3. List Tutorial Group for a programme");
        System.out.println("0. Quit");
        System.out.print("Enter choice: ");
        int choice = scanner.nextInt();
        scanner.nextLine();
        System.out.println();
        return choice;
        
    }

}
