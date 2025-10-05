import Header from "../headers/Header.jsx";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from '../../api/firebaseConfigs.js'; // Adjust path as needed

export default function Tracker() {
    const [itemToShow, setItemToShow] = useState({
        logForm: true,
        report: false,
        Dailytracker: false,
        updateMode: false,
    });

    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Form state
    const [formData, setFormData] = useState({
        foodType: 'Dairy',
        foodName: '',
        mealType: 'Breakfast',
        mealDate: new Date().toISOString().split('T')[0],
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        servingSize: '',
        notes: ''
    });

    const [editingMeal, setEditingMeal] = useState(null);

    // Food database with nutritional information
    const foodDatabase = {
        Dairy: [
            { name: 'Milk (1 cup)', calories: 103, protein: 8, carbs: 12, fat: 2.4 },
            { name: 'Yogurt (1 cup)', calories: 149, protein: 8.5, carbs: 11.4, fat: 8 },
            { name: 'Cheese (1 oz)', calories: 113, protein: 7, carbs: 0.9, fat: 9 },
            { name: 'Egg (large)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 }
        ],
        Vegetables: [
            { name: 'Broccoli (1 cup)', calories: 31, protein: 2.6, carbs: 6, fat: 0.3 },
            { name: 'Carrot (medium)', calories: 25, protein: 0.6, carbs: 6, fat: 0.1 },
            { name: 'Spinach (1 cup)', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1 },
            { name: 'Bell Pepper (medium)', calories: 31, protein: 1, carbs: 7, fat: 0.3 }
        ],
        Fruits: [
            { name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
            { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
            { name: 'Orange (medium)', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },
            { name: 'Grapes (1 cup)', calories: 104, protein: 1.1, carbs: 27.3, fat: 0.2 }
        ],
        Grains: [
            { name: 'Rice (1 cup cooked)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
            { name: 'Bread (1 slice)', calories: 79, protein: 3.1, carbs: 14.5, fat: 1 },
            { name: 'Oatmeal (1 cup cooked)', calories: 166, protein: 5.9, carbs: 28.1, fat: 3.6 },
            { name: 'Pasta (1 cup cooked)', calories: 221, protein: 8.1, carbs: 43.2, fat: 1.3 }
        ],
        Protein: [
            { name: 'Chicken Breast (3 oz)', calories: 128, protein: 26, carbs: 0, fat: 2.7 },
            { name: 'Salmon (3 oz)', calories: 177, protein: 17, carbs: 0, fat: 11 },
            { name: 'Beef (3 oz)', calories: 213, protein: 22, carbs: 0, fat: 13 },
            { name: 'Tofu (3 oz)', calories: 70, protein: 8, carbs: 2, fat: 4 }
        ],
        Oils: [
            { name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 14 },
            { name: 'Butter (1 tbsp)', calories: 102, protein: 0.1, carbs: 0, fat: 12 },
            { name: 'Avocado (medium)', calories: 234, protein: 2.9, carbs: 12, fat: 21 }
        ]
    };

    // Load meals from Firestore
    const loadMeals = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "nutritionMeals"),
                where("mealDate", "==", selectedDate),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            const mealsData = [];
            querySnapshot.forEach((doc) => {
                mealsData.push({ id: doc.id, ...doc.data() });
            });
            setMeals(mealsData);
        } catch (error) {
            console.error("Error loading meals:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadMeals();
    }, [selectedDate]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-fill nutritional info when food name is selected
        if (name === 'foodName' && value) {
            const foodCategory = foodDatabase[formData.foodType];
            const selectedFood = foodCategory.find(food => food.name === value);
            if (selectedFood) {
                setFormData(prev => ({
                    ...prev,
                    calories: selectedFood.calories,
                    protein: selectedFood.protein,
                    carbs: selectedFood.carbs,
                    fat: selectedFood.fat
                }));
            }
        }
    };

    // Save meal to Firestore
    const saveMeal = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const mealData = {
                ...formData,
                timestamp: serverTimestamp(),
                totalCalories: parseInt(formData.calories) || 0,
                totalProtein: parseInt(formData.protein) || 0,
                totalCarbs: parseInt(formData.carbs) || 0,
                totalFat: parseInt(formData.fat) || 0
            };

            if (editingMeal) {
                // Update existing meal
                await updateDoc(doc(db, "nutritionMeals", editingMeal.id), mealData);
                setEditingMeal(null);
            } else {
                // Add new meal
                await addDoc(collection(db, "nutritionMeals"), mealData);
            }

            // Reset form and reload meals
            setFormData({
                foodType: 'Dairy',
                foodName: '',
                mealType: 'Breakfast',
                mealDate: new Date().toISOString().split('T')[0],
                calories: '',
                protein: '',
                carbs: '',
                fat: '',
                servingSize: '',
                notes: ''
            });
            loadMeals();
        } catch (error) {
            console.error("Error saving meal:", error);
        }
        setLoading(false);
    };

    // Edit meal
    const editMeal = (meal) => {
        setFormData({
            foodType: meal.foodType,
            foodName: meal.foodName,
            mealType: meal.mealType,
            mealDate: meal.mealDate,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            servingSize: meal.servingSize || '',
            notes: meal.notes || ''
        });
        setEditingMeal(meal);
        setItemToShow({ logForm: true, report: false, Dailytracker: false, updateMode: true });
    };

    // Delete meal
    const deleteMeal = async (mealId) => {
        if (window.confirm("Are you sure you want to delete this meal?")) {
            try {
                await deleteDoc(doc(db, "nutritionMeals", mealId));
                loadMeals();
            } catch (error) {
                console.error("Error deleting meal:", error);
            }
        }
    };

    // Calculate daily totals
    const calculateDailyTotals = () => {
        return meals.reduce((totals, meal) => ({
            calories: totals.calories + (parseInt(meal.calories) || 0),
            protein: totals.protein + (parseInt(meal.protein) || 0),
            carbs: totals.carbs + (parseInt(meal.carbs) || 0),
            fat: totals.fat + (parseInt(meal.fat) || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    };

    const dailyTotals = calculateDailyTotals();

    // Navigation functions
    const showSection = (section) => {
        setItemToShow({
            logForm: section === 'logForm',
            report: section === 'report',
            Dailytracker: section === 'Dailytracker',
            updateMode: false
        });
        setEditingMeal(null);
        setFormData({
            foodType: 'Dairy',
            foodName: '',
            mealType: 'Breakfast',
            mealDate: new Date().toISOString().split('T')[0],
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            servingSize: '',
            notes: ''
        });
    };

    return (
        <div className={'container min-w-full px-2 py-0 min-h-screen bg-gray-100'}>
            <Header headerProps={{
                title: 'Nutrition Tracker',
                navLinks: [
                    {label: 'Schedules', path: '/schedule'},
                    {label: 'Study Plan', path: '/studyPlan'},
                    {label: 'Job Search', path: '/jobSearch'}
                ]
            }}/>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => showSection('logForm')}
                            className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                                itemToShow.logForm 
                                ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                        >
                            Log Meal
                        </button>
                        <button
                            onClick={() => showSection('Dailytracker')}
                            className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                                itemToShow.Dailytracker 
                                ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                        >
                            Daily Progress
                        </button>
                        <button
                            onClick={() => showSection('report')}
                            className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                                itemToShow.report 
                                ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                        >
                            Nutrition Report
                        </button>
                    </div>
                </div>
            </div>

            <section className={'container mx-auto px-4 py-6'}>

                {/* Log Meal Form */}
                {itemToShow.logForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className={'text-center text-2xl font-bold mb-6'}>
                            {editingMeal ? 'Edit Meal' : 'Log New Meal'}
                        </h3>
                        <form onSubmit={saveMeal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Food Type */}
                            <div>
                                <label htmlFor={'foodType'} className={'block text-sm font-medium text-gray-700 mb-1'}>Food Type: </label>
                                <select
                                    name={'foodType'}
                                    value={formData.foodType}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                >
                                    {Object.keys(foodDatabase).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Food Name */}
                            <div>
                                <label htmlFor={'foodName'} className={'block text-sm font-medium text-gray-700 mb-1'}>Food Name: </label>
                                <select
                                    name={'foodName'}
                                    value={formData.foodName}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                >
                                    <option value="">Select a food</option>
                                    {foodDatabase[formData.foodType].map(food => (
                                        <option key={food.name} value={food.name}>{food.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Meal Type */}
                            <div>
                                <label htmlFor={'mealType'} className={'block text-sm font-medium text-gray-700 mb-1'}>Meal Type: </label>
                                <select
                                    name={'mealType'}
                                    value={formData.mealType}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                >
                                    <option>Breakfast</option>
                                    <option>Lunch</option>
                                    <option>Snack</option>
                                    <option>Dinner</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label htmlFor={'mealDate'} className={'block text-sm font-medium text-gray-700 mb-1'}>Date: </label>
                                <input
                                    type='date'
                                    name={'mealDate'}
                                    value={formData.mealDate}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                />
                            </div>

                            {/* Nutritional Information */}
                            <div>
                                <label htmlFor={'calories'} className={'block text-sm font-medium text-gray-700 mb-1'}>Calories: </label>
                                <input
                                    type='number'
                                    name={'calories'}
                                    value={formData.calories}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={'protein'} className={'block text-sm font-medium text-gray-700 mb-1'}>Protein (g): </label>
                                <input
                                    type='number'
                                    name={'protein'}
                                    value={formData.protein}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={'carbs'} className={'block text-sm font-medium text-gray-700 mb-1'}>Carbs (g): </label>
                                <input
                                    type='number'
                                    name={'carbs'}
                                    value={formData.carbs}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={'fat'} className={'block text-sm font-medium text-gray-700 mb-1'}>Fat (g): </label>
                                <input
                                    type='number'
                                    name={'fat'}
                                    value={formData.fat}
                                    onChange={handleInputChange}
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                    required
                                />
                            </div>

                            {/* Serving Size and Notes */}
                            <div className="md:col-span-2">
                                <label htmlFor={'servingSize'} className={'block text-sm font-medium text-gray-700 mb-1'}>Serving Size: </label>
                                <input
                                    type='text'
                                    name={'servingSize'}
                                    value={formData.servingSize}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1 cup, 100g"
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor={'notes'} className={'block text-sm font-medium text-gray-700 mb-1'}>Notes: </label>
                                <textarea
                                    name={'notes'}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Any additional notes..."
                                    rows="3"
                                    className={'w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2 flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (editingMeal ? 'Update Meal' : 'Log Meal')}
                                </button>
                                {editingMeal && (
                                    <button
                                        type="button"
                                        onClick={() => showSection('logForm')}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* Daily Progress */}
                {itemToShow.Dailytracker && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className={'text-center text-2xl font-bold mb-6'}>Daily Progress - {selectedDate}</h3>

                        {/* Date Selector */}
                        <div className="mb-6">
                            <label htmlFor="progressDate" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Date:
                            </label>
                            <input
                                type="date"
                                id="progressDate"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Daily Totals */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-red-600">{dailyTotals.calories}</div>
                                <div className="text-sm text-red-800">Calories</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{dailyTotals.protein}g</div>
                                <div className="text-sm text-blue-800">Protein</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-600">{dailyTotals.carbs}g</div>
                                <div className="text-sm text-green-800">Carbs</div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-yellow-600">{dailyTotals.fat}g</div>
                                <div className="text-sm text-yellow-800">Fat</div>
                            </div>
                        </div>

                        {/* Meal List */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold mb-4">Today's Meals</h4>
                            {meals.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No meals logged for this date.</p>
                            ) : (
                                meals.map(meal => (
                                    <div key={meal.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="font-semibold text-lg">{meal.foodName}</h5>
                                                <p className="text-sm text-gray-600">
                                                    {meal.mealType} • {meal.foodType} • {meal.servingSize}
                                                </p>
                                                <div className="flex gap-4 mt-2 text-sm">
                                                    <span className="text-red-600">{meal.calories} cal</span>
                                                    <span className="text-blue-600">{meal.protein}g protein</span>
                                                    <span className="text-green-600">{meal.carbs}g carbs</span>
                                                    <span className="text-yellow-600">{meal.fat}g fat</span>
                                                </div>
                                                {meal.notes && (
                                                    <p className="text-sm text-gray-500 mt-2">{meal.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => editMeal(meal)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteMeal(meal.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Nutrition Report */}
                {itemToShow.report && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className={'text-center text-2xl font-bold mb-6'}>Nutrition Report</h3>
                        <div className="text-center text-gray-500 py-8">
                            <p>Nutrition reports and analytics coming soon!</p>
                            <p className="text-sm mt-2">This section will include weekly/monthly summaries, progress charts, and nutritional insights.</p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}