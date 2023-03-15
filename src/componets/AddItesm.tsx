import React, { useEffect, useState } from "react";
import IItem from "../models/item.type";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  GridItem,
  Button,
  Box,
  Flex,
  useToast,
  CardBody,
  Text,
  Card,
  Heading,
} from "@chakra-ui/react";
import "../styles/Error.css";
import instance from "../api/api";
import axios from "axios";

function AddItem() {
  const toast = useToast();
  const [items, setItems] = useState<IItem[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IItem>();

  const onSubmit = async (data: IItem) => {
    console.log(data);
    try {
      const response = await instance.post("/api/v1/items/addItem", data);
      if (response) {
        //do something
        toast({
          title: "Item created.",
          description: "Item added successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setItems(items.concat(response.data));
        
      }
      if (!response) {
        toast({
          title: "Item not created.",
          description: "Item not added. Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Item not created.",
          description: "Item not added. Please try again later.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return error.message;
      }
      return "An unexpected error occurred";
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let dataFetched = false;

    async function fetchAllItems() {
      if (!dataFetched) {
        const response = await instance.get("/api/v1/items");
        console.log(response.data);
        setItems(response.data);
      }
    }
    fetchAllItems();
    return () => {
      dataFetched = true;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <Flex
        w="full"
        h="full"
        p={10}
        alignItems="flex-start"
        justify="space-between"
        direction={{ base: "column", md: "row" }}
      >
        <Box w="full" mr={20}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <SimpleGrid
              columns={2}
              columnGap={3}
              rowGap={6}
              w="full"
              py={25}
              ml={[0, 0, 50]}
            >
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Heading mb="5" size="lg">
                  Add Items
                </Heading>
                <FormControl isRequired>
                  <FormLabel htmlFor="title" fontWeight={800} className="label">
                    Title
                  </FormLabel>
                  <Input
                    id="firstName"
                    placeholder="Title"
                    {...register("title", {
                      required: "Item title is required",
                    })}
                  />
                  {errors?.title && (
                    <p className="error">{errors.title.message}</p>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel
                    htmlFor="description"
                    fontWeight={800}
                    className="label"
                  >
                    Description
                  </FormLabel>
                  <Input
                    placeholder="Description"
                    id="surname"
                    {...register("description", {
                      required: "Item Description is required",
                    })}
                  />
                  {errors?.description && (
                    <p className="error">{errors.description.message}</p>
                  )}
                </FormControl>
                <Button
                  size="lg"
                  w="full"
                  mt="2rem"
                  colorScheme="teal" 
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Submit
                </Button>
              </GridItem>
            </SimpleGrid>
          </form>
        </Box>
      </Flex>

      {items.map((item: IItem, index) => (
        <div>
          <Card className="card">
            <CardBody>
              <Heading size='xs'>{item.title}</Heading>
              <Text>{item.description}</Text>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default AddItem;
