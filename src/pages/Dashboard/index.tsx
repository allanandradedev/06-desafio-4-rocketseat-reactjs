import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useState, useEffect } from 'react';
import { FoodData } from '../../components/types/FoodData';


function Dashboard () {
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData)
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFood() {
      const response = await api.get('/foods');
      setFoods(response.data);
    };

    loadFood();

  }, [])

  async function handleAddFood (food: FoodData) {
    const actualFoods = [...foods]

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...actualFoods, response.data]);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: FoodData) {
    const actualFoods = [...foods]

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = actualFoods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood (id: number) {
    const actualFoods = [...foods];

    await api.delete(`/foods/${id}`);

    const foodsFiltered = actualFoods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal () {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal () {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood (food: FoodData) {
    setEditingFood(food)
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
