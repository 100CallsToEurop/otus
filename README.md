Команды установки приложения

В charts.yaml прописаны репозитории (prometheus, grafana, postgresql, ingress-nginx, rabbitmq)

1. sudo helm dependency update
2. sudo helm install metrics .
3. После запуска всех pods применить:
   - sudo kubectl apply -f job-auth.yaml - для миграций в сервис авторизации
   - sudo kubectl apply -f job-billing.yaml - для миграций в сервис биллинга
   - sudo kubectl apply -f job-notification.yaml - для миграций в сервис уведомлений
   - sudo kubectl apply -f job-order.yaml - для миграций в сервис заказов
  

Описание архитектурного решения и схема взаимодействия сервисов

![image](https://github.com/user-attachments/assets/7bfa2bed-eb9b-4fcd-89ff-8491e28d9ef1)

Для решения был выбран подход с асинхронным общением между микросервисами. Для лющения был выбран брокер rabbitMq
