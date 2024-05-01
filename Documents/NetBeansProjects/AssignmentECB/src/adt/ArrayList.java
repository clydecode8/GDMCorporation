/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package adt;

/**
 *
 * @author Kok Ming Han
 * 
 */
import java.io.Serializable;

public class ArrayList<T> implements ListInterface<T> {

    
    private T[] array;
    private int numberOfEntries;
    private static final int DEFAULT_CAPACITY = 5;
    private Node firstNode;
    
    public ArrayList() {
        this(DEFAULT_CAPACITY);
    }
    
    public ArrayList(int initialCapacity){
        
        numberOfEntries = 0;
        array = (T[]) new Object[initialCapacity];
    }
 
//------------------------------------------------------
    //Official Implementation of Interfaces
//------------------------------------------------------
    
    //Adding new element
    @Override
    public boolean add(T newElement) {
        
        if(isArrayFull()){
            
            //Doubles size of array if its full
            doubleArray();
        }
        
        array[numberOfEntries] = newElement;
        numberOfEntries++;
        
        //Node Size
        Node newNode = new Node(newElement);
        newNode.next = firstNode;
        firstNode = newNode;
        
        return true;
        
    }

    //Adding new element to specific position
    @Override
    public boolean add(int newPosition, T newElement) {
       
        boolean status = true;
        
        //Checks if the position exceeds 1 & less than current entries+1
        //Current Entries+1 is because entries start from 0
        if((newPosition >= 1) && (newPosition <= numberOfEntries+1)){


            if(isArrayFull()){

                doubleArray();
            }

            makeRoom(newPosition);
            array[newPosition - 1] = newElement;      
            
            //Node Size
            Node newNode = new Node(newElement);
            newNode.next = firstNode;
            firstNode = newNode;
            
            
        }else{
            
            status = false;
        }
        
        return status;

    }
    
    //Removing element at specific position
    @Override
    public T remove(int indexPosition) {
        
        T result = null;
        
        //Checks if the position exceeds 1 & less than current entries
        if((indexPosition >= 1) && (indexPosition <= numberOfEntries)){
            
            //Stores the array value onto result
            result = array[indexPosition - 1];
            
            if(indexPosition < numberOfEntries){
                
                //Removes the gap when noEntries exceed index
                removeGap(indexPosition);
            }

            numberOfEntries--;
            
            //Node Size
            //add removal of nodes
            
            
        }else{
            
            //Invalid result
            result = null;
            
        }
        
        return result;
    }
    
    //Getting the value at specific position
    @Override
    public T getEntry(int indexPosition) {
        
        T result = null;
        
        //Validation whether indexPosition in range of 1 and numberofentries
        if((indexPosition >= 1) && (indexPosition <= numberOfEntries)){
            
            result = array[indexPosition];
        }

        return result;
    }

    //Checks whether list contains specific Element
    @Override
    public boolean contains(T givenElement) {
        
        boolean status = false;
        
        //Validation Check
        //!status = If FALSE meaning that it has not been found
        //!status = If TRUE meaning that it has been found
        //Better efficiency instead of constant looping
        
        for (int index = 0; !status && (index < numberOfEntries); index++) {
        
            if (givenElement.equals(array[index])) {
                status = true;
            }
        }
        
        return status;       
        
    }

    //Checks whether Empty
    @Override
    public boolean isEmpty() {
        
        //Returns false if not empty, true if empty
        return numberOfEntries == 0;
    }
    
    //Checks whether full
    @Override
    public boolean isFull() {
        
        //Dynamic Array where size is increased every time array is full is being used
        return false;
    }
    
    //Clears everything
    @Override
    public void clear() {
        
        //Enhance efficiency 
        for (int i = 0; i < array.length; i++) {
            array[i] = null;
        }
        
        numberOfEntries = 0;
    }
    
    //Replace element at specific position
    @Override
    public boolean replace(int indexPosition, T newElement) {

        boolean status = true;
        
        //Validation to check indexPosition whether in range of 1 and noEntries
        if ((indexPosition >= 1) && (indexPosition <= numberOfEntries)){
            
            array[indexPosition - 1] = newElement;
            
        }else{
            
            status = false;
        }
        
        return status;
        
        
    }
    
    //Get the index of the element
    @Override
    public int getIndexOf(T givenElement){
        
        int index = -1;
        
        //Cannot be 0
        if (numberOfEntries == 0) {
            
            return -1; // Return -1 to indicate failure
        }
        
        //Loop through array to find the element
        for(int i = 0; i <= numberOfEntries; i++){
            
            if(array[i].equals(givenElement)){
                
                index = i;
                break;
                
            }
        }
        
        return index;        
    }
    
    //Finds the size of the list
    @Override
    public int size(){
        
        //Returns the number of values inside of the list
        return size(firstNode);
    }
    
    public int size(Node passInFirstNode){
        
        if(passInFirstNode == null){
            
            return 0;
            
        }else{
            
            return 1 + size(passInFirstNode.next);
        }
    }
    
    
    //Sort Function
    //Merge sort is the fastest
    //It splits the array into half (A, B)
    //A will be sorted, B will be sorted
    //Final results will be the merged A and B
    @Override
    public void mergeSort(T[] arr, int startIndex, int endIndex) {
        
        if (startIndex < endIndex) {
            int middleIndex = (startIndex + endIndex) / 2;
            mergeSort(arr, startIndex, middleIndex);
            mergeSort(arr, middleIndex + 1, endIndex);
            merge(arr, startIndex, middleIndex, endIndex);
        }
        
    }

    // Helper method to merge two sorted subarrays
    private void merge(T[] arr, int startIndex, int middleIndex, int endIndex) {
        
        int leftLength = middleIndex - startIndex + 1;
        int rightLength = endIndex - middleIndex;

        // Create temporary arrays
        Object[] leftArray = new Object[leftLength];
        Object[] rightArray = new Object[rightLength];

        // Copy data to temporary arrays leftArray[] and rightArray[]
        for (int i = 0; i < leftLength; ++i){
            
            leftArray[i] = arr[startIndex + i];
        }
        
        for (int j = 0; j < rightLength; ++j){
            
            rightArray[j] = arr[middleIndex + 1 + j];
        }
        
        // Merge the temporary arrays
        int i = 0, j = 0;
        int k = startIndex;
        
        while (i < leftLength && j < rightLength) {
            
            //Retrieving leftArray[i] and casting to Comparable
            Comparable<T> left = (Comparable<T>) leftArray[i];
            
            if (left.compareTo((T) rightArray[j]) <= 0) {
                arr[k] = (T) leftArray[i];
                i++;
                
            } else {
                
                arr[k] = (T) rightArray[j];
                j++;
                
            }
            
            k++;
        }

        // Copy remaining elements of leftArray[] if any
        while (i < leftLength) {
            arr[k] = (T) leftArray[i];
            i++;
            k++;
        }

        // Copy remaining elements of rightArray[] if any
        while (j < rightLength) {
            arr[k] = (T) rightArray[j];
            j++;
            k++;
        }
    }    
    
    
    
//------------------------------------------------------   
    //Extra methods for implementation
//------------------------------------------------------
    
    private class Node {
        
        private Node next;
        private T data;
        
        private Node(T data){
            
            this.data = data;
            this.next = null;
        }
        
        private Node(Node next){
            
            this.data = data;
            this.next = next;
        }
    }
    
    
    //Check whether the array is full
    private boolean isArrayFull(){
        
        //Returns True when No of entries same as array length
        return numberOfEntries == array.length;
        
    }
    
    //Pushes the index to the back, add()
    private void makeRoom(int newPosition){
        
        int newIndex = newPosition - 1;
        int lastIndex = numberOfEntries - 1;
        
        //Moves each entry to the next higher index
        //Starts at the end of array until it reaches newIndex
        //Better efficiency
        //{0, 1, 2} -> {_, 0, 1, 2}
        //0 and the following numbers will be moved to the back
        for (int i = lastIndex; i >= newIndex; i--){
            
            array[i+1] = array[i];
            
        }
        
    }
    
    //Removes the gap for remove()
    private void removeGap(int givenPosition) {
        
        /*
        * Task: Shifts entries that are beyond the entry to be removed to the next
        * lower position. Precondition: array is not empty; 1 <= givenPosition <
        * numberOfEntries; numberOfEntries is array's numberOfEntries before removal.
        */

        int removedIndex = givenPosition - 1;
        int lastIndex = numberOfEntries - 1;

        for (int i = removedIndex; i < lastIndex; i++) {
            array[i] = array[i + 1];
        }
        
    }
    
    //Doubles the size of array
    private void doubleArray(){
        
        T[] oldArray = array;
        array = (T[]) new Object[oldArray.length * 2];
        for (int i = 0; i < oldArray.length; i++) {
            
            array[i] = oldArray[i];
            
        }
    }

    
    
    
}

