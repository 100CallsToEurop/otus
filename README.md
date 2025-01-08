Команды установки приложения

k8s:

1. папка metrics
   В charts.yaml прописаны репозитории (prometheus, grafana, ingress-nginx, rabbitmq)
   1) sudo helm dependency update
   2) sudo helm install metrics .

2. папка auth
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install auth .

3. папка billing
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install billing .

4. папка order
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install order .
  
5. папка delivery
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install delivery .
      
6. папка warehouse
   В charts.yaml прописаны репозитории (postgresql)
   1) sudo helm dependency update
   2) sudo helm install warehouse .

7. Применить jobs для миграций:
   - sudo kubectl apply -f ./auth/job-auth.yaml
   - sudo kubectl apply -f ./billing/job-billing.yaml
   - sudo kubectl apply -f ./order/job-order.yaml
   - sudo kubectl apply -f ./delivery/job-delivery.yaml
   - sudo kubectl apply -f ./warehouse/job-warehouse.yaml
  

Описание того, какой паттерн для реализации распределенной транзакции использовался

Для решения был выбран паттерн "Saga" с реализацией "Оркестратор".

В качестве "Оркестратора" выступает сервис "order", который управляет шагами саги.

В качестве сервиса оплаты был выбран сервис "billing", который управляет "Кошельком" пользователя, который пополняется отдельно.

Сценарий:
1. Пользователь регистрируется
2. Пользователь авторизуется
3. У пользователя создается "Кошелек"
4. Пользователь пополняет кошелек
5. Создаются несколько товаров
6. Создается курьер
7. Пользователь выбирает из списка товары
8. Пользователь оформляет заказ
   Заказ принимает статус "Ожидание" и как только начинается сага, статус принимает статус "Ожидание оплаты"
9. Заказ сперва списывает деньги и принимает статус "Ожидание резервирования товаров"
   В случае неудачи, списание средств не происходит, заказ принимает статус "Отменен" и видно причину отмены (Не удалось списать средства)
   Сага не выполняется
10. Выполняется резервация товаров и заказ принимает статус "Ожидание резервирования курьера"
   В случае неудачи, резервация товаров не происходит, заказ принимает статус "Отменен" и видно причину отмены (Не удалось зарезервировать товары)
   Происходит "компенсационное действие" по возврату списанных средств.
   Сага не выполняется
11. Выполняется резервация курьера и заказ принимает статус "Готов"
   В случае неудачи, резервация курьера не происходит, заказ принимает статус "Отменен" и видно причину отмены (Не удалось зарезервировать курьера)
   Происходит "компенсационное действие" по возврату списанных средств
   Происходит "компенсационное действие" по отмену зарезервированных товаров
   Сага не выполняется

P.S. Товар считается зарезервированным кем-то, если у него quantity: 0, при создании товара quantity: 1
     У курьера есть availabilitySlot (массив). При резервации курьера в массив добавляется дата, на которую он зарезервирован. Если массив пустой или его пытаются зарезервировать на дату, которой нет в availabilitySlot, то он считается свободным

![Снимок экрана 2025-01-08 в 14 26 23](https://github.com/user-attachments/assets/e78bf3ba-16de-4d99-9ed8-7c22b024ff52)

Скриншоты работы программы:
1. Регистрация и авторизация пользователя
![1  Регистрация и авторизация пользователя](https://github.com/user-attachments/assets/d6a63277-5280-41ce-a331-70549b31a414)
2. Получение баланса пользователя и его пополнение
![2  Получение баланса пользователя и его пополнение](https://github.com/user-attachments/assets/092852dd-db0a-45f7-850b-ab38039cdf49)
3. Создание 3-х новых товаров
![3  Создание 3-х новых товаров](https://github.com/user-attachments/assets/5423a9d7-61fe-4ce6-8126-f2eff036fb0d)
4. Получение всех товаров, создание нового курьера и получение всех курьеров
![4  Получение всех товаров, создание нового курьера и получение всех курьеров](https://github.com/user-attachments/assets/75568cb3-a346-44ef-940d-5e293cf8098e)
5. Создание заказа (Успешного) и получение о нем информации
![5  Создание заказа (Успешного) и получение о нем информации](https://github.com/user-attachments/assets/d956c2d6-c7a6-404f-a73c-ec0374561bff)
6. Проверка, что деньги списались, продукты и курьер зарезервированы
![6  Проверка, что деньги списались, продукты и курьер зарезервированы](https://github.com/user-attachments/assets/439e49b1-adc6-4b8b-95ee-567537e7cbcd)
7. Создание заказа (Недостаточно средств на балансе) и получение о нем информации
![7  Создание заказа (Недостаточно средств на балансе) и получение о нем информации](https://github.com/user-attachments/assets/6d86878e-e5f9-4be4-b5cd-a05c9eef4463)
8. Проверка, что деньги не списались, товары и курьер не поменяли состояние
![8  Проверка, что деньги не списались, товары и курьер не поменяли состояние](https://github.com/user-attachments/assets/acdf49cd-f29e-445c-8acf-36b7d6a9a094)
9. Пополнение баланса пользователя и создание заказа (Резервирование товаров, которые уже зарезервированы) и получение о нем информации
![9  Пополнение баланса пользователя и создание заказа (Резервирование товаров, которые уже зарезервированы) и получение о нем информации](https://github.com/user-attachments/assets/c7e3add6-a552-47bb-8065-96d15ccfa8e2)
10. Проверка, что деньги не списались, товары и курьер не поменяли состояние
![10  Проверка, что деньги не списались, товары и курьер не поменяли состояние](https://github.com/user-attachments/assets/29616df3-78a9-479d-85ad-81d951c351fc)
11. Создание заказа (Нет свободного курьера на определенную дату) и получение о нем информации
![11  Создание заказа (Нет свободного курьера на определенную дату) и получение о нем информации](https://github.com/user-attachments/assets/16e30fed-5322-45d1-94d3-52716e65e8ef)
12. Проверка, что деньги не списались, товары и курьер не поменяли состояние
![12  Проверка, что деньги не списались, товары и курьер не поменяли состояние](https://github.com/user-attachments/assets/310267b0-8f47-4cf4-b9b9-7047caa6ef8a)
