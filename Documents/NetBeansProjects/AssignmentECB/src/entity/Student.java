/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package entity;

import java.util.Objects;

/**
 *
 * @author User
 */
public class Student {

  private String name;
  private String id;
  private TutorialGroup tutorialGroup;

  public Student() {
      
      name = "";
      id = "";
      tutorialGroup = null;
  }

  public Student(String name, String id, TutorialGroup tutorialGroup) {

    this.name = name;
    this.id = id;
    this.tutorialGroup = tutorialGroup;
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
