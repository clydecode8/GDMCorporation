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
public class GroupManagementUI {
    
    Scanner scanner = new Scanner(System.in);

    public int getMenuChoice() {
        
        System.out.println("Tutorial Group Management System");
        System.out.println("\n---------------------------");
        System.out.println("1. Manage Programme Tutorial Group ");
        System.out.println("2. Manage Student Tutorial Group");
        System.out.println("3. Summary Report");
        System.out.println("0. Quit");
        System.out.print("Enter choice: ");
        int choice = scanner.nextInt();
        scanner.nextLine();
        System.out.println();
        return choice;
        
    }
    
    public void manageProgrammeGroup(){
        
        
        
    }
    
    
    
    public void manageStudentGroup(){
        
        
        
    }
    
    public void summaryReport(){
        
        
        
    }

    
}
