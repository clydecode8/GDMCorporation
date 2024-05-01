/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entity;

/**
 *
 * @author User
 */
public class Programme {
 
    private String name;
    private String id;

    public Programme() {

    }

    public Programme(String name, String id ) {

      this.name = name;
      this.id = id;
    }


    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getID() {
      return name;
    }

    public void setID(String id) {
      this.id = id;
    }
   
}
